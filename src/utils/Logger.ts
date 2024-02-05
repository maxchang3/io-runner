import * as vscode from 'vscode'

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE"

export class Logger {
    logChannel: vscode.OutputChannel
    constructor() {
        this.logChannel = vscode.window.createOutputChannel('IO Runner', { log: true })
    }
    show() {
        this.logChannel.show()
    }
    appendLine(level: LogLevel, message: string) {
        this.logChannel.appendLine(`[${level}] ${message}`)
    }
    info(message: string) {
        this.appendLine("INFO", message)
    }
    showError(errorMessage: string) {
        this.appendLine("ERROR", errorMessage)
        this.show()
        vscode.commands.executeCommand('setContext', 'io-runner.running', false)
    }
}
