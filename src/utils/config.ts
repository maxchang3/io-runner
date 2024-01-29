import * as vscode from 'vscode'
import { replaceVariables } from '@c4312/vscode-variables'
import type { ComputedLaunchConfiguration, IORunneronfig, LaunchConfiguration } from '@/types/config'

export const resolveConfigVariable = (string: string) => replaceVariables(string)

let extensionConfig: IORunneronfig
let launchTasks: Map<string, vscode.Task>
let launchConfigs: Map<string, ComputedLaunchConfiguration>

/**
 * @from https://stackoverflow.com/a/61703141
 */
export const executeTask = async (task: vscode.Task) => {
    const execution = await vscode.tasks.executeTask(task)
    return new Promise<void>(resolve => {
        let disposable = vscode.tasks.onDidEndTask(e => {
            if (e.execution !== execution) return
            disposable.dispose()
            resolve()
        })

    })
}

const fetchTaks = async () => {
    const tasks = await vscode.tasks.fetchTasks()
    const launchTask = new Map<string, vscode.Task>()
    tasks.forEach(task => { launchTask.set(task.definition.label, task) })
    return launchTask
}

const fetchConfigs = (folder?: vscode.WorkspaceFolder, type?: string) => {
    const WorkspaceConfigs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('launch', folder)
    const configs = WorkspaceConfigs.get<LaunchConfiguration[]>('configurations')
    let computedConfigs: ComputedLaunchConfiguration[] = configs as ComputedLaunchConfiguration[]
    computedConfigs = computedConfigs.filter(
        (config: any) => config.name && config.request === "launch" && type ? (config.type === type) : true
    )
    const launchConfigs: Map<string, ComputedLaunchConfiguration> = new Map()
    computedConfigs.forEach(config => {
        if (!config.program) {
            console.error(`Launch config: "${config.name}" has no program name to execute!`)
            return
        }
        config.computedTasks = new Promise(async resolve => {
            const preLaunchTask = await getComputedTask(config.preLaunchTask)
            const postDebugTask = await getComputedTask(config.postDebugTask)
            resolve({ preLaunchTask, postDebugTask })
        })
        const interpreter = extensionConfig.launchInterpreter[config.type]
        if (interpreter) {
            if (config.args) config.args.unshift(config.program)
            else config.args = [config.program]
            config.program = interpreter
        }
        config.computeVariables = () => ({
            program: resolveConfigVariable(config.program!),
            args: config.args ? config.args.map(resolveConfigVariable) : [],
            cwd: config.cwd ? resolveConfigVariable(config.cwd) : undefined
        })
        launchConfigs.set(config.name, config)
    })
    return launchConfigs
}

const getComputedTask = async (taskName?: string) => {
    if (!taskName) return undefined
    return new Promise<vscode.Task | undefined>(async (resolve) => {
        if (!launchTasks) launchTasks = await fetchTaks()
        resolve(launchTasks.get(taskName))
    })
}

/**
 * @from https://github.com/microsoft/vscode-cpptools/
 */
export const getLaunchConfig = (launchName: string, folder?: vscode.WorkspaceFolder, type?: string) => {
    if (!launchConfigs) launchConfigs = fetchConfigs(folder, type)
    return launchConfigs.get(launchName)
}

export const resolveConfig = (folder?: vscode.WorkspaceFolder) => {
    if (!extensionConfig) extensionConfig = vscode.workspace.getConfiguration().get<IORunneronfig>('io-runner')!
    return extensionConfig
}
