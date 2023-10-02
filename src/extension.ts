import { window } from 'vscode'
import type { ExtensionContext } from 'vscode'
import { RunnerPanelProvider } from '@/panels/RunnerPanel'


export function activate(context: ExtensionContext) {
    const provider = new RunnerPanelProvider(context.extensionUri)
    context.subscriptions.push(
        window.registerWebviewViewProvider(
            RunnerPanelProvider.viewType,
            provider,
        )
    )
}

export function deactivate() {
}
