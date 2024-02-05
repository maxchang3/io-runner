import * as vscode from 'vscode'
import { postCommandToView } from '@/utils'
import type { CommandParameters } from '@/types/commands'
import type { RunnerPanelProvider } from '@/panels/RunnerPanel'

export const RunCommand = (provider: RunnerPanelProvider): CommandParameters => [
    'io-runner.run',
    () => {
        const view = provider.getWebviewView()
        if (!view) return
        vscode.commands.executeCommand('setContext', 'io-runner.running', true)
        const postCommand = postCommandToView(view)
        postCommand.prepareRun()
    }
]

export const StopCommand = (provider: RunnerPanelProvider): CommandParameters => [
    'io-runner.stop',
    () => {
        const view = provider.getWebviewView()
        if (!view) return
        const postCommand = postCommandToView(view)
        postCommand.prepareStop()
    }
]
