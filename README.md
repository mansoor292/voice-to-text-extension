# Voice to Text Chrome Extension

This Chrome extension allows users to convert voice input to text directly in the browser.

## Features

- Voice recording and conversion to text
- Easy-to-use popup interface
- Insertion of converted text into active text fields

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked" and select the project directory

## Usage

1. Click on the extension icon in the Chrome toolbar
2. Press the record button and speak
3. The converted text will appear in the popup
4. Click to insert the text into the active text field

## Development

- `src/components`: React components for the popup interface
- `src/services`: Core functionality for speech recognition and text insertion
- `src/utils`: Helper functions and browser API utilities
- `public`: Static files including HTML and icons

## Testing

Run tests using:

```
npm test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)