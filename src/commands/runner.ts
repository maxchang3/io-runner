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
