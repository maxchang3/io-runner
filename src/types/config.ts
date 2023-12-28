import type { DebugConfiguration } from 'vscode'

export interface IORunneronfig {
    taskMap: Record<string, string[]>
}

export interface LaunchConfiguration extends DebugConfiguration {
    /** Task to run before debug session starts. */
    preLaunchTask?: string

    /** Task to run after debug session ends.  */
    postDebugTask?: string

    /** Path to the program to debug.  */
    program?: string

    /** Program arguments.  */
    args?: string[]

    /** Program working directory. */
    cwd?: string
}
