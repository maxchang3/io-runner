import * as vscode from 'vscode'
import { replaceVariables } from '@c4312/vscode-variables'
import type { ComputedLaunchConfiguration, IORunneronfig, LaunchConfiguration } from '@/types/config'

export class ConfigManager {
    private folder?: vscode.WorkspaceFolder
    public extensionConfigs: IORunneronfig
    public launchConfigs: Map<string, ComputedLaunchConfiguration>
    private constructor(folder?: vscode.WorkspaceFolder) {
        this.folder = folder
        this.extensionConfigs = this.resolveExtensionConfigs()
        this.launchConfigs = this.resolveLaunchConfigs()
    }
    static init(folder?: vscode.WorkspaceFolder) {
        return new ConfigManager(folder)
    }
    public async updateConfigs(type: "extension" | "launch") {
        switch (type) {
            case "extension":
                this.extensionConfigs = this.resolveExtensionConfigs()
                break
            case "launch":
                this.launchConfigs = this.resolveLaunchConfigs()
                break
        }
    }
    private resolveConfigVariable(string: string) {
        return replaceVariables(string)
    }
    private resolveLaunchConfigs(type?: string) {
        const configs = vscode.workspace.getConfiguration('launch', this.folder).get<LaunchConfiguration[]>('configurations')
        const launchConfigs: Map<string, ComputedLaunchConfiguration> = new Map()
        const computedConfigs: ComputedLaunchConfiguration[] = configs as ComputedLaunchConfiguration[]
        for (const config of computedConfigs) {
            if (!(config.name && config.request === "launch" && type ? (config.type === type) : true)) continue
            if (!config.program) {
                console.error(`Launch config: "${config.name}" has no program name to execute!`)
                continue
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
        }
        return launchConfigs
    }

    private resolveExtensionConfigs() {
        return vscode.workspace.getConfiguration().get<IORunneronfig>('io-runner')!
    }
}