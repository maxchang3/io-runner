import * as vscode from "vscode"
import {
    ConfigManager,
    postCommandToView,
    recieveCommandFromView,
    executeProgram,
    executeTask,
} from "@/utils"
import type { CommandMessageSender } from "@/utils"
import { Runner } from "@/utils/runner"

const getFilenameAndExt = (editor?: vscode.TextEditor) => [editor?.document.fileName || "", editor?.document.fileName.split(".").pop() || ""] as const

const changeDoc = (postCommand: CommandMessageSender, configManager: ConfigManager, editor?: vscode.TextEditor,) => {
    const [filename, ext] = getFilenameAndExt(editor)
    if (editor) postCommand.changeDoc({ filename, ext })
    vscode.commands.executeCommand(
        'setContext',
        'io-runner.runable',
        !!configManager.extensionConfigs.taskMap[ext]
    )
}

export const init = async (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    const configManager = ConfigManager.init()
    registerEvents(view, postCommand, configManager)
    handleWebviewCommand(view, postCommand, configManager)
    postCommand.init(configManager.extensionConfigs)
    changeDoc(postCommand, configManager, vscode.window.activeTextEditor)
}

const registerEvents = (view: vscode.Webview, postCommand: CommandMessageSender, configManager: ConfigManager) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        changeDoc(postCommand, configManager, editor)
    })
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("io-runner")) {
            configManager.updateConfigs("extension")
            postCommand.init(configManager.extensionConfigs)
            changeDoc(postCommand, configManager, vscode.window.activeTextEditor)
        }
        if (e.affectsConfiguration("launch")) configManager.updateConfigs("launch")
    })
}

const handleWebviewCommand = (view: vscode.Webview, postCommand: CommandMessageSender, configManager: ConfigManager) => {
    let runner: Runner
    recieveCommandFromView(view, {
        test: (data) => {
            vscode.window.showInformationMessage(data)
        },
        run: async ({ launchName, stdin }) => {
            const timeStart = performance.now()
            const targetLaunch = configManager.launchConfigs.get(launchName)
            if (!targetLaunch) throw new Error(`Launch "${launchName}" not found`)
            runner = new Runner(targetLaunch, stdin, configManager)
            runner.run()
            runner.on("output", ({ stdout, stderr, exitCode }) => {
                if (stderr) throw new Error(`${stderr}`)
                const timeEnd = performance.now()
                postCommand.endRun({
                    stdout,
                    exitCode,
                    time: timeEnd - timeStart
                })
                vscode.commands.executeCommand('setContext', 'io-runner.running', false)
            })
            // const { preLaunchTask, postDebugTask } = targetLaunch
            // if (preLaunchTask) await executeTask(preLaunchTask)
            // const { program, args, cwd } = targetLaunch.computeVariables()
            // if (!program) throw new Error(`Launch program is not defined`)
            // const { stdout, stderr, exitCode } = await executeProgram(program, stdin, args, cwd)
            // if (stderr) throw new Error(`${stderr}`)
            // const timeEnd = performance.now()
            // postCommand.endRun({
            //     stdout,
            //     exitCode,
            //     time: timeEnd - timeStart
            // })
            // vscode.commands.executeCommand('setContext', 'io-runner.running', false)
            // if (postDebugTask) await executeTask(postDebugTask)
        },
        stop: async () => {
            await runner.stop()
            vscode.commands.executeCommand('setContext', 'io-runner.running', false)
        }
    })
}
