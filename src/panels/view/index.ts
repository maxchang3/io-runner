import { getUri, getNonce } from "@/utils/webview"
import type { Uri, Webview } from 'vscode'

export const getPanelHTML = (
    webview: Webview,
    extensionUri: Uri,
) => {
    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce()
    const scriptUris = [
        getUri(webview, extensionUri, ['dist', 'webview.js'])
    ]
    const styleUris = [
        getUri(webview, extensionUri, ['assets', 'main.css'])
    ]
    return /*html*/`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${styleUris.map(style => `<link href="${style}" rel="stylesheet">`).join('\n')}
    </head>
    <body>
        <div id="app">
            <vscode-task-selector id="selector"></vscode-task-selector>
            <div class="editor input" >
                <vscode-text-area resize="none" autofocus>
                    <div slot="label">INPUT</div>
                </vscode-text-area>
            </div>
            <div class="editor output" >
                <vscode-text-area resize="none" readonly>
                    <div slot="label">OUTPUT</div>
                </vscode-text-area>
            </div>
        </div>
        ${scriptUris.map(script => `<script type="module" nonce="${nonce}" src="${script}"></script>`).join('\n')}
    </body>
    </html>`
}

