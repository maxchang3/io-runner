import * as vscode from 'vscode'

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE"

export class Logger {
    private static instance: Logger | null = null
    private logChannel: vscode.OutputChannel

    private constructor() {
        this.logChannel = vscode.window.createOutputChannel('IO Runner', { log: true })
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    public show() {
        this.logChannel.show()
    }

    public appendLine(level: LogLevel, message: string) {
        this.logChannel.appendLine(`[${level}] ${message}`)
    }

    public info(message: string) {
        this.appendLine("INFO", message)
    }

    public showError(errorMessage: string) {
        this.appendLine("ERROR", errorMessage)
        this.show()
        vscode.commands.executeCommand('setContext', 'io-runner.running', false)
    }
}
