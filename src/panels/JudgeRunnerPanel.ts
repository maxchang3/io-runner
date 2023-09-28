import { window } from "vscode"
import type * as vscode from "vscode"
import { getPanelHTML } from "./view"

export class PanelProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'judge-runner.panel';
    private _view?: vscode.WebviewView

    constructor(private readonly _extensionUri: vscode.Uri) { }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView
        this._view.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                this._extensionUri
            ]
        }
        this._view.webview.html = getPanelHTML(this._view.webview, this._extensionUri)
        this._view.webview.onDidReceiveMessage(data => {
            switch (data.command) {
                case 'test':
                    {
                        window.showInformationMessage('howdy')
                        break
                    }
            }
        })
    }
}

