import * as vscode from 'vscode'
import type { IORunneronfig, LaunchConfiguration } from '@/types/config'

const groupByUniqueKey = <T extends vscode.DebugConfiguration>(
    array: T[],
    key: keyof T
) => array.reduce(
    (acc, value) => {
        acc[value[key]] = value
        return acc
    },
    {} as Record<string, T | undefined>
)

/**
 * https://github.com/microsoft/vscode-cpptools/
 */
const getLaunchTasks = (folder?: vscode.WorkspaceFolder, type?: string) => {
    const WorkspaceConfigs: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration('launch', folder)
    let configs = WorkspaceConfigs.get<vscode.DebugConfiguration[]>('configurations')
    if (!configs) return undefined
    configs = configs.filter((config: any) => config.name && config.request === "launch" && type ? (config.type === type) : true)
    return configs
}

type NameToTasks = Record<string, LaunchConfiguration | undefined>

export const resolveConfig = (folder?: vscode.WorkspaceFolder) => {
    const settingTaskMap = vscode.workspace.getConfiguration().get<IORunneronfig>('io-runner')!
    // const allTasks = getLaunchTasks(folder)
    return settingTaskMap
}
