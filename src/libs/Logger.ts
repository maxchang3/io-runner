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
        // this.outputChannel.clear() can not entirely clear 
        vscode.commands.executeCommand("workbench.output.action.clearOutput")
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
        this.show(true)
        this.clear()
        this.appendLine("ERROR", errorMessage)
    }
}

export const logger = Logger.getInstance()
