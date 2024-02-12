import * as vscode from "vscode"

export namespace ViewContext {
    export const setRunning = (status: boolean) => vscode.commands.executeCommand('setContext', 'io-runner.running', status)
    export const setRunable = (status: boolean) => vscode.commands.executeCommand('setContext', 'io-runner.runable', status)
}
