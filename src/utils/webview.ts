import { Uri, Webview } from "vscode"

export const getUri = (webview: Webview, extensionUri: Uri, pathList: string[]) =>
    webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList))

export const getNonce = () => {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
