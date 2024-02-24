import * as vscode from 'vscode'
import { ViewContext, createCommandSender } from '@/utils'
import type { CommandParameters } from '@/types'
import type { RunnerPanelProvider } from '@/panels/RunnerPanel'

export const RunCommand = (provider: RunnerPanelProvider): CommandParameters => [
    'io-runner.run',
    () => {
        const view = provider.getWebviewView()
        if (!view) return
        vscode.commands.executeCommand("io-runner.panel.focus")
        ViewContext.setRunning(true)
        const commandSender = createCommandSender(view)
        commandSender.prepareRun()
    }
]

export const StopCommand = (provider: RunnerPanelProvider): CommandParameters => [
    'io-runner.stop',
    () => {
        const view = provider.getWebviewView()
        if (!view) return
        const commandSender = createCommandSender(view)
        commandSender.prepareStop()
    }
]
