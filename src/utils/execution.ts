import * as vscode from 'vscode'
import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from 'node:child_process'

/**
 * @from https://stackoverflow.com/a/61703141
 */
export const executeTask = async (taskName: string) => {
    await vscode.commands.executeCommand('workbench.action.tasks.runTask', taskName)
    return new Promise<void>(resolve => {
        let disposable = vscode.tasks.onDidEndTask(e => {
            if (e.execution.task.name !== taskName) return
            disposable.dispose()
            resolve()
        })
    })
}

const isTaskExecuting = (taskName: string) => vscode.tasks.taskExecutions.some(e => e.task.name === taskName)

export const terminateTask = async (taskName: string, dependsOnTaskName?: string) => {
    if (dependsOnTaskName && isTaskExecuting(dependsOnTaskName)) await vscode.commands.executeCommand('workbench.action.tasks.terminate', dependsOnTaskName)
    if (isTaskExecuting(taskName)) await vscode.commands.executeCommand('workbench.action.tasks.terminate', taskName)
}

export const executeProgram = (filename: string, stdin: string, args?: readonly string[], cwd?: string): [ChildProcessWithoutNullStreams, Promise<{
    stdout: string
    stderr: string
    exitCode: number
}>] => {
    const child = spawn(filename, args, { cwd })
    return [child, new Promise(resolve => {
        let stdout = ''
        let stderr = ''
        child.stdout.on('data', (data) => {
            stdout += data
        })

        child.stderr.on('data', (data) => {
            stderr += data
        })

        child.on('close', (code) => {
            resolve({
                stdout,
                stderr,
                exitCode: code || 0
            })
        })

        if (stdin) child.stdin.write(stdin)
        child.stdin.end()
    })]
}
