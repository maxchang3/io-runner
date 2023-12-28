import * as vscode from 'vscode'
import { RunCommand, StopCommand, ToggleCommand } from "@/commands"
import { RunnerPanelProvider } from '@/panels/RunnerPanel'
import type { CommandParameters } from '@/types'
import type { ExtensionContext, Disposable } from 'vscode'

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
            StopCommand,
            ToggleCommand,
        ])
    )
}

export function deactivate() {
}
