# Chrome Extension Builder

# Chrome Extension Builder

Chrome Extension Builder is a command-line tool that simplifies the process of creating a basic structure for Chrome extensions. It generates a skeleton project with essential files and configurations, allowing developers to quickly start building their Chrome extensions.

## Author

Keith I Myers

- Website: [https://kmyers.me](https://kmyers.me)
- GitHub: [https://github.com/KeithIMyers](https://github.com/KeithIMyers)

## Documentation

For detailed information on how to use and extend your Chrome extension, please visit our comprehensive guide:

[Chrome Extension Development Guide](https://chromeos.guide/ChromeOS-Guide/Development/Chrome-Extension-Development/Chrome-Extension-Builder)

## Basic Usage

To use the Chrome Extension Builder, follow these steps:

1. Install the package globally:

```
npm install -g chrome-extension-builder
```

2. Run the builder:
   
```
chrome-extension-builder
```




3. Follow the prompts to enter your extension details:
- Extension Name
- Version
- Description
- Author

4. The tool will generate a new directory with your extension name, containing all necessary files:
- `manifest.json` (Manifest V3)
- `popup.html` (Basic UI with button)
- `popup.js` (Popup interaction logic)
- `background.js` (Background service worker)
- `icons/` (Directory with icons in different sizes)

5. Navigate to the newly created directory and start building your extension!

## Loading Your Extension in Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked" and select your extension directory

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.