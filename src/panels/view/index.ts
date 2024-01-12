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
    const styleUris: string[] = [
    ]
    return /*html*/`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${styleUris ? styleUris.map(style => `<link href="${style}" rel="stylesheet">`).join('\n') : ''}
    </head>
    <body>
        <vscode-app></vscode-app>
        ${scriptUris ? scriptUris.map(script => `<script type="module" nonce="${nonce}" src="${script}"></script>`).join('\n') : ''}
    </body>
    </html>`
}

