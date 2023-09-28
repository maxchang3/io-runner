const html = (strings, ...values) => String.raw({ raw: strings }, ...values);

const getPanelHTML = (nonce, scriptUris, styleUris) => {
    return html`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' script-src 'nonce-${nonce}';">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        ${styleUris.map(style => `<link href="${style}" rel="stylesheet">`).join('\n')}
    </head>
    <body>
        <div id="app">
            <!-- <vscode-button id="howdy">Howdy!</vscode-button> -->
            <div class="editor input" >
                <vscode-text-area resize="none" autofocus>INPUT</vscode-text-area>
            </div>
            <div class="editor output" >
                <vscode-text-area resize="none" readonly value="test">OUTPUT</vscode-text-area>
            </div>
        </div>
        ${scriptUris.map(script => `<script type="module" nonce="${nonce}" src="${script}"></script>
        `).join('\n')}
    </body>
    </html>`
}

console.log(getPanelHTML(114514, [''], ['']))
