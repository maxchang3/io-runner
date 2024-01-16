import * as vscode from "vscode"
import { resolveConfig, postCommandToView, recieveCommandFromView } from "@/utils"
import type { CommandMessageSender } from "@/utils"

const getFilenameExt = (editor?: vscode.TextEditor) => editor?.document.fileName.split(".").pop() || ""

export const init = (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    registerEvents(view, postCommand)
    handleWebviewCommand(view)
    const config = resolveConfig()
    postCommand.init(config)
    const ext = getFilenameExt(vscode.window.activeTextEditor)
    postCommand.changeDoc(ext)
}

const registerEvents = (view: vscode.Webview, postCommand: CommandMessageSender) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        postCommand.changeDoc(getFilenameExt(editor))
    })
}

const handleWebviewCommand = (view: vscode.Webview) => {
    recieveCommandFromView(view, {
        test: (data) => {
            vscode.window.showInformationMessage(data)
        },
        run: () => {
            vscode.window.showInformationMessage('run')
        },
        stop: () => {
            vscode.window.showInformationMessage('stop')
        }
    })
}
