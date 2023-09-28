import { Uri, Webview } from "vscode"

export const getUri = (webview: Webview, extensionUri: Uri, pathList: string[]) =>
    webview.asWebviewUri(Uri.joinPath(extensionUri, ...pathList))
