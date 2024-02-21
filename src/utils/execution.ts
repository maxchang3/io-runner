import * as vscode from 'vscode'
import { spawn } from 'node:child_process'
import type { ChildProcessWithoutNullStreams } from "node:child_process"
import { Readable } from 'node:stream'

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

interface IReadable extends Readable {
    on(event: "close", listener: () => void): this
    on(event: "data", listener: (chunk: Buffer) => void): this
    on(event: "end", listener: () => void): this
    on(event: "error", listener: (err: Error) => void): this
    on(event: "pause", listener: () => void): this
    on(event: "readable", listener: () => void): this
    on(event: "resume", listener: () => void): this
}

interface ChildProcess extends ChildProcessWithoutNullStreams {
    stdout: IReadable
    stderr: IReadable
}

export const executeProgram = (filename: string, stdin: string, args?: readonly string[], cwd?: string) => {
    const child: ChildProcess = spawn(filename, args, { cwd })
    return [child, new Promise<{
        stdout: ArrayBuffer[],
        stderr: ArrayBuffer[],
        exitCode: number
    }>(resolve => {
        const stdout: ArrayBuffer[] = []
        const stderr: ArrayBuffer[] = []

        child.stdout.on('data', (data: Buffer) => {
            stdout.push(data.buffer)
        })

        child.stderr.on('data', (data: Buffer) => {
            stderr.push(data.buffer)
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
    })] as const
}
