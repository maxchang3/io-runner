import { spawn } from 'node:child_process'

export const execProgram = (filename: string, stdin: string, args?: readonly string[], cwd?: string): Promise<{
    stdout: string
    stderr: string
    exitCode: number
}> => {
    return new Promise((resolve, reject) => {
        const child = spawn(filename, args, { cwd })

        let output = ''
        child.stdout.on('data', (data) => {
            output += data
        })

        child.stderr.on('data', (data) => {
            resolve({
                stdout: output,
                stderr: data.toString(),
                exitCode: child.exitCode || 1
            })
        })

        child.on('close', (code) => {
            resolve({
                stdout: output,
                stderr: '',
                exitCode: code || 0
            })
        })

        if (stdin) child.stdin.write(stdin)
        child.stdin.end()
    })
}
