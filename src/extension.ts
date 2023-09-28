import { window, debug } from 'vscode'
import type { ExtensionContext } from 'vscode'
import { PanelProvider } from '@/panels/JudgeRunnerPanel'


export function activate(context: ExtensionContext) {
    const provider = new PanelProvider(context.extensionUri)
    context.subscriptions.push(
        window.registerWebviewViewProvider(
            PanelProvider.viewType,
            provider,
        )
    )
}

export function deactivate() {
}
