import * as vscode from 'vscode'

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE"

class Logger {
    private static instance: Logger | null = null
    private outputChannel: vscode.OutputChannel

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('IO Runner', { log: true })
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger()
        }
        return Logger.instance
    }

    public clear() {
        this.outputChannel.clear()
    }

    public show(preserveFocus: boolean = false) {
        this.outputChannel.show(preserveFocus)
    }

    public appendLine(level: LogLevel, message: string) {
        this.outputChannel.append(`[${level}] ${message}\n`)
    }

    public info(message: string) {
        this.appendLine("INFO", message)
    }

    public showError(errorMessage: string) {
        this.appendLine("ERROR", errorMessage)
        this.show(true)
    }
}

export const logger = Logger.getInstance()
