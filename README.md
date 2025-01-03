# GDX Viewer VS Code Extension

## Overview
GDX Viewer is a Visual Studio Code extension that allows you to view and analyze GDX files generated by GAMS. The extension uses the `gdxdump` utility to convert GDX files into CSV format and displays them in a webview with pagination for easy browsing of large datasets.

## Features
- Open `.gdx` files directly in Visual Studio Code.
- Convert `.gdx` files to CSV format using `gdxdump`.
- Display data in a tabular format with pagination for large datasets.
- Navigate through large datasets using Previous and Next buttons.

## Requirements
- **GAMS Installation**: Ensure that GAMS is installed on your system.
- **PATH Setup**: Add the GAMS executable directory to your system's PATH environment variable. This allows the `gdxdump` command to be recognized.

## Installation
1. Clone the repository or download the `.vsix` file.
2. Open Visual Studio Code.
3. Go to the Extensions view (`Ctrl+Shift+X`).
4. Click the ellipsis menu (`...`) in the top-right corner and select **Install from VSIX**.
5. Choose the downloaded `.vsix` file.

## Usage
1. Open the Command Palette (`Ctrl+Shift+P`).
2. Search for and run the command `GDX Viewer: Open File`.
3. Select a `.gdx` file to open.
4. View the data in a webview with pagination controls.

## Error Handling
- If the `gdxdump` command is not found, the extension will display an error message asking you to check if GAMS is installed and its binaries are added to your PATH.
- Errors encountered during file processing are shown as notifications in Visual Studio Code.

## Development
### Prerequisites
- Node.js
- Yeoman and VS Code Extension Generator:
  ```bash
  npm install -g yo generator-code
  ```

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gdx-viewer
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Open the project in Visual Studio Code.
4. Press `F5` to run the extension in a new Extension Development Host.

## Packaging
To package the extension into a `.vsix` file:
1. Install the VSCE tool:
   ```bash
   npm install -g vsce
   ```
2. Run the following command:
   ```bash
   vsce package
   ```
3. This will generate a `.vsix` file that can be distributed or installed locally.

## Known Issues
- Large datasets may take time to load into the webview.
- Ensure the GAMS version supports the `gdxdump` command.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.

