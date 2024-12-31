// Import required VS Code API
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { spawn } = require('child_process');

/**
 * Run gdxdump on the appropriate environment.
 * @param {string} gdxFile - The GDX file to process.
 * @param {boolean} isRemote - Whether the workspace is remote.
 * @returns {Promise<string>} - A promise that resolves to the temporary file path.
 */
function runGdxDump(gdxFile, isRemote) {
    return new Promise((resolve, reject) => {
        const command = 'gdxdump';
        const args = [gdxFile];
        const tempFile = path.join(os.tmpdir(), `${path.basename(gdxFile)}.csv`);

        // Determine the spawn options based on local or remote execution
        const spawnOptions = isRemote ? {} : { shell: true }; // Use shell for better PATH resolution locally
        const gdxdump = spawn(command, args, spawnOptions);

        const writeStream = fs.createWriteStream(tempFile);
        gdxdump.stdout.pipe(writeStream);

        gdxdump.on('close', (code) => {
            if (code === 0) {
                resolve(tempFile); // Return the path to the temp file
            } else {
                reject(new Error(`gdxdump exited with code ${code}`));
            }
        });

        gdxdump.on('error', (error) => {
            if (error.code === 'ENOENT') {
                vscode.window.showErrorMessage(
                    `The 'gdxdump' command was not found. Please ensure that it is installed and available in your PATH.`
                );
            }
            reject(error);
        });
    });
}

/**
 * Display GDX data in a webview without pagination.
 * @param {string} filePath - Path to the GDX file.
 */
async function displayGdxData(filePath) {
    try {
        const isRemote = vscode.env.remoteName !== undefined;
        const tempFile = await runGdxDump(filePath, isRemote);
        const dataStream = fs.createReadStream(tempFile, { encoding: 'utf-8' });
        const chunks = [];

        dataStream.on('data', (chunk) => {
            chunks.push(chunk);
        });

        dataStream.on('end', () => {
            const data = chunks.join('');
            showWebview(data);
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Error processing GDX file: ${error.message}`);
    }
}

/**
 * Show GDX data in a webview.
 * @param {string} data - GDX data to display.
 */
function showWebview(data) {
    const rows = data.split('\n').map(row => row.split(','));

    const panel = vscode.window.createWebviewPanel(
        'gdxViewer',
        'GDX Viewer',
        vscode.ViewColumn.One,
        { enableScripts: true }
    );

    panel.webview.html = generateWebviewContent(rows);
}

/**
 * Generate HTML content for the webview.
 * @param {Array} rows - Rows of GDX data.
 * @returns {string} - HTML content for the webview.
 */
function generateWebviewContent(rows) {
    const tableHeader = rows[0] ? `<tr><th>${rows[0].join('</th><th>')}</th></tr>` : '';
    const tableBody = rows.slice(1).map(row => `<tr><td>${row.join('</td><td>')}</td></tr>`).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GDX Viewer</title>
    <style>
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 8px;
        }
        th {
            background-color: #f4f4f4;
            text-align: left;
        }
    </style>
</head>
<body>
    <h1>GDX Data Viewer</h1>
    <table>
        <thead>${tableHeader}</thead>
        <tbody>${tableBody}</tbody>
    </table>
</body>
</html>`;
}

/**
 * Activate the extension.
 * @param {vscode.ExtensionContext} context 
 */
function activate(context) {
    console.log('GDX Viewer extension is now active!');

    // Register a command to open GDX files
    let disposable = vscode.commands.registerCommand('gdxViewer.openFile', async () => {
        const options = {
            canSelectMany: false,
            openLabel: 'Open GDX File',
            filters: {
                'GDX Files': ['gdx'],
                'All Files': ['*']
            }
        };

        const fileUri = await vscode.window.showOpenDialog(options);
        if (fileUri && fileUri[0]) {
            const filePath = fileUri[0].fsPath;
            displayGdxData(filePath);
        }
    });

    context.subscriptions.push(disposable);
}

/**
 * Deactivate the extension.
 */
function deactivate() {}

module.exports = {
    activate,
    deactivate
};
