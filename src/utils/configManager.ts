import * as vscode from 'vscode'
import { replaceVariables } from '@c4312/vscode-variables'
import type { ComputedLaunchConfiguration, IORunneronfig, LaunchConfiguration } from '@/types/config'

export class ConfigManager {
    private folder?: vscode.WorkspaceFolder
    public extensionConfigs: IORunneronfig
    public launchConfigs: Map<string, ComputedLaunchConfiguration>
    public taskConfigs: Map<string, vscode.Task>
    private constructor(tasks: Map<string, vscode.Task>, folder?: vscode.WorkspaceFolder,) {
        this.folder = folder
        this.taskConfigs = tasks
        this.extensionConfigs = this.resolveExtensionConfigs()
        this.launchConfigs = this.resolveLaunchConfigs()
    }
    static async init(folder?: vscode.WorkspaceFolder) {
        const tasks = await this.resolveTasksConfigs()
        return new ConfigManager(tasks, folder)
    }
    public async updateConfigs(type: "extension" | "launch" | "tasks") {
        switch (type) {
            case "extension":
                this.extensionConfigs = this.resolveExtensionConfigs()
                break
            case "launch":
                this.launchConfigs = this.resolveLaunchConfigs()
                break
            case "tasks":
                this.taskConfigs = await ConfigManager.resolveTasksConfigs()
                break
        }
    }
    private resolveConfigVariable(string: string) {
        return replaceVariables(string)
    }

    private resolveLaunchConfigs(type?: string) {
        const WorkspaceConfigs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('launch', this.folder)
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
            config.computedTasks = {
                preLaunchTask: config.preLaunchTask ? this.taskConfigs.get(config.preLaunchTask) : undefined,
                postDebugTask: config.postDebugTask ? this.taskConfigs.get(config.postDebugTask) : undefined
            }
            const interpreter = this.extensionConfigs.launchInterpreter[config.type]
            if (interpreter) {
                if (config.args) config.args.unshift(config.program)
                else config.args = [config.program]
                config.program = interpreter
            }
            config.computeVariables = () => ({
                program: this.resolveConfigVariable(config.program!),
                args: config.args ? config.args.map(this.resolveConfigVariable) : [],
                cwd: config.cwd ? this.resolveConfigVariable(config.cwd) : undefined
            })
            launchConfigs.set(config.name, config)
        })
        return launchConfigs
    }

    private resolveExtensionConfigs() {
        return vscode.workspace.getConfiguration().get<IORunneronfig>('io-runner')!
    }

    private static async resolveTasksConfigs() {
        const fetchedTasks = await vscode.tasks.fetchTasks()
        const tasks = new Map<string, vscode.Task>()
        fetchedTasks.forEach(task => { tasks.set(task.name, task) })
        return tasks
    }
}
