import * as vscode from 'vscode'
import type { CommandParameters } from '@/types/commands'

export const RunCommand: CommandParameters = [
    'io-runner.run',
    () => {

    }
]

export const StopCommand: CommandParameters = [
    'io-runner.stop',
    () => {
        vscode.window.showInformationMessage('test')
    }
]

export const ToggleCommand: CommandParameters = [
    'io-runner.toggle',
    () => {
        vscode.window.showQuickPick([
            '1',
            '2',
            '3'
        ], {
            canPickMany: false
        })
    }
]

