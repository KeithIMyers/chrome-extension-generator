#!/usr/bin/env node
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const sharp = require('sharp');
const chalk = require('chalk');

function displayBanner() {
  console.log(chalk.blue(`
  ______ _                              ______      _                 _             
 / _____) |                            |  ____|    | |               (_)            
| /     | | ____ ___  ____  _____  ____| |__  __  _| |_ ___ ____  ___ _  ___  ____  
| |     | |/ ___) _ \\|    \\| ___ |/ ___)  __)(  \\/ ) _) _ \\  _ \\/___)| |/ _ \\|  _ \\ 
| \\_____| | |  | |_| | | | | ____( (___| |____\\  /| |_| |_| | | |___ | | |_| | | | |
 \\______)_|_|   \\___/|_|_|_|_____)____)______)\\/\\ ___) ___/ |_| (___/|_|\\___/|_| |_|

 ______                           _             
/ _____)                         | |            
 /  ___  ____ ____   ____  ____ _| |_ ___   ____ 
 | (___)/ _  |  _ \ / _  )/ ___) _  ) _ \ / ___)
 \____( ( | | | | ( (/ /| |  ( (_| | |_| | |    
\_____)\\_||_|_| |_|\____)_|   \____|\___/|_|

`));

  console.log(chalk.yellow('by Keith I Myers'));
  console.log(chalk.green('Website: https://kmyers.me'));
  console.log(chalk.green('Documentation: https://chromeos.guide/ChromeOS-Guide/Development/Chrome-Extension-Development/Chrome-Extension-Generator'));
  console.log(chalk.green('GitHub: https://github.com/KeithIMyers/chrome-extension-generator'));
  console.log('\n');
}
const questions = [
  {
    type: 'input',
    name: 'name',
    message: 'Extension Name:',
  },
  {
    type: 'input',
    name: 'version',
    message: 'Version:',
    default: '1.0.0',
  },
  {
    type: 'input',
    name: 'description',
    message: 'Description:',
  },
  {
    type: 'input',
    name: 'author',
    message: 'Author:',
  },
];

async function generateIcons(dir) {
  const sizes = [16, 48, 128];
  for (const size of sizes) {
    await sharp({
      create: {
        width: size,
        height: size,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    })
      .png()
      .toFile(path.join(dir, `icon${size}.png`));
  }
}

async function createPopupHtml(dir) {
  const popupHtml = `<!DOCTYPE html>
<html>
<head>
  <title>Extension Popup</title>
  <style>
    body {
      width: 300px;
      padding: 10px;
      font-family: Arial, sans-serif;
    }
    .container {
      text-align: center;
    }
    .button {
      margin: 10px;
      padding: 8px 16px;
      background-color: #4285f4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .button:hover {
      background-color: #357abd;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Hello World!</h2>
    <button id="clickMe" class="button">Click Me!</button>
    <div id="message"></div>
    <div class="footer">
      Learn more about Chrome Extension development at 
      <a href="https://chromeos.guide/ChromeOS-Guide/Development/Chrome-Extension-Development/Chrome-Extension-Builder" 
         target="_blank">ChromeOS Guide</a>
    </div>
  </div>
  <script src="popup.js"></script>
</body>
</html>`;

  await fs.writeFile(path.join(dir, 'popup.html'), popupHtml);
}

async function createPopupJs(dir) {
  const popupJs = `// Popup script
document.addEventListener('DOMContentLoaded', function() {
  // Get button element
  const button = document.getElementById('clickMe');
  const messageDiv = document.getElementById('message');

  // Add click event listener
  button.addEventListener('click', function() {
    // Send message to background script
    chrome.runtime.sendMessage({action: 'buttonClicked'}, function(response) {
      messageDiv.textContent = response.message;
    });
  });
});`;

  await fs.writeFile(path.join(dir, 'popup.js'), popupJs);
}

async function createBackgroundJs(dir) {
  const backgroundJs = `// Background script
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === 'buttonClicked') {
      // Handle the button click
      sendResponse({message: 'Hello from the background script!'});
    }
    return true; // Will respond asynchronously
  }
);

// Example of chrome extension API usage
chrome.runtime.onInstalled.addListener(function() {
  console.log('Extension installed!');
});`;

  await fs.writeFile(path.join(dir, 'background.js'), backgroundJs);
}

async function createExtension() {
  displayBanner();
  try {
    const answers = await inquirer.prompt(questions);

    const extDir = answers.name.toLowerCase().replace(/\s/g, '-');
    await fs.ensureDir(extDir);

    // Create manifest.json (V3)
    const manifest = {
      manifest_version: 3,
      name: answers.name,
      version: answers.version,
      description: answers.description,
      author: answers.author,
      action: {
        default_popup: 'popup.html',
        default_icon: {
          16: 'icons/icon16.png',
          48: 'icons/icon48.png',
          128: 'icons/icon128.png'
        }
      },
      background: {
        service_worker: 'background.js'
      },
      icons: {
        16: 'icons/icon16.png',
        48: 'icons/icon48.png',
        128: 'icons/icon128.png'
      },
      permissions: []
    };

    // Create all required files
    await fs.writeJSON(path.join(extDir, 'manifest.json'), manifest, { spaces: 2 });
    await fs.ensureDir(path.join(extDir, 'icons'));
    await generateIcons(path.join(extDir, 'icons'));
    await createPopupHtml(extDir);
    await createPopupJs(extDir);
    await createBackgroundJs(extDir);

    console.log(`
Chrome Extension generated successfully in ${extDir}!

Files created:
- manifest.json (Manifest V3)
- popup.html (Basic UI with button)
- popup.js (Popup interaction logic)
- background.js (Background service worker)
- icons/ (Directory with icons in different sizes)

To load your extension in Chrome:
1. Open Chrome and go to chrome://extensions/
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select the "${extDir}" directory

Start building by modifying the generated files. Visit https://chromeos.guide/ChromeOS-Guide/Development/Chrome-Extension-Development/Chrome-Extension-Generator for more information.
    `);
  } catch (error) {
    console.error('Error generating extension:', error);
    process.exit(1);
  }
}

createExtension();