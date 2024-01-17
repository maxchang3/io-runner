import * as vscode from 'vscode'
import { RunCommand, StopCommand } from "@/commands"
import { RunnerPanelProvider } from '@/panels/RunnerPanel'
import type { CommandParameters } from '@/types'
import type { ExtensionContext, Disposable } from 'vscode'

const registerCommands = (commands: CommandParameters[]): Disposable[] =>
    commands.map((command) => vscode.commands.registerCommand(...command))

export function activate(context: ExtensionContext) {
    const provider = new RunnerPanelProvider(context.extensionUri)
    const options = {
        webviewOptions: {
            retainContextWhenHidden: true
        }
    }
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            RunnerPanelProvider.viewType,
            provider,
            options
        ),
        ...registerCommands([
            RunCommand(provider),
            StopCommand,
        ])
    )
}

export function deactivate() {
}
