import * as vscode from "vscode"
import { resolveConfig, postCommandToView } from "@/utils"
import type { CommandMessageSender } from "@/utils"

const getFilenameExt = (editor?: vscode.TextEditor) => editor?.document.fileName.split(".").pop() || ""

export const init = (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    const config = resolveConfig()
    postCommand.init(config)
    const ext = getFilenameExt(vscode.window.activeTextEditor)
    postCommand.changeDoc({ ext })
    registerEvents(view, postCommand)
}

const registerEvents = (view: vscode.Webview, postCommand: CommandMessageSender) => {
    vscode.window.onDidChangeActiveTextEditor(e => {
        postCommand.changeDoc({ ext: getFilenameExt(e) })
    })
}
