import * as vscode from 'vscode'
import { RunCommand, StopCommand } from "@/commands"
import { RunnerPanelProvider } from '@/panels/RunnerPanel'
import type { ExtensionContext, Disposable } from 'vscode'
import type { CommandParameters } from '@/types/commands'

const registerCommands = (commands: CommandParameters[]): Disposable[] =>
    commands.map((command) => vscode.commands.registerCommand(...command))

export function activate(context: ExtensionContext) {
    const provider = new RunnerPanelProvider(context.extensionUri)
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            RunnerPanelProvider.viewType,
            provider,
        ),
        ...registerCommands([
            RunCommand,
            StopCommand
        ])
    )
}

export function deactivate() {
}
