import * as vscode from "vscode"
import { getPanelHTML } from "./view"
import { init } from "./handler"
import { recieveCommandFromView } from "@/utils"


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
        init(this._view.webview)
    }
}

