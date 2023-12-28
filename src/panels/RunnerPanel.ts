import { window } from "vscode"
import { resolveConfig, postMessageToWebview } from "@/utils"
import { getPanelHTML } from "./view"
import type { IORunneronfig } from "@/types"
import type * as vscode from "vscode"

let config: IORunneronfig

const init = (view: vscode.Webview) => {
    if (config) return
    config = resolveConfig()
    postMessageToWebview(
        view,
        "init",
        config
    )
}

export class RunnerPanelProvider implements vscode.WebviewViewProvider {
    public static readonly viewType = 'io-runner.panel';
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
        init(this._view.webview)
    }
}

