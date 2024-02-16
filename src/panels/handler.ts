import * as vscode from "vscode"
import { Runner, ConfigManager, logger, postCommandToView, recieveCommandFromView, ViewContext } from "@/utils"
import type { CommandMessageSender } from "@/utils"

const getFilenameAndExt = (editor?: vscode.TextEditor) => [editor?.document.fileName || "", editor?.document.fileName.split(".").pop() || ""] as const

const changeDoc = (postCommand: CommandMessageSender, config: ConfigManager, editor?: vscode.TextEditor,) => {
    const [filename, ext] = getFilenameAndExt(editor)
    if (editor) postCommand.changeDoc({ filename, ext })
    vscode.commands.executeCommand(
        'setContext',
        'io-runner.runable',
        !!config.extensionConfigs.launchMap[ext]
    )
}

export const init = async (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    const config = ConfigManager.getInstance()
    registerEvents(view, postCommand, config)
    handleWebviewCommand(view, postCommand, config)
    postCommand.init(config.extensionConfigs)
    changeDoc(postCommand, config, vscode.window.activeTextEditor)
}

const registerEvents = (view: vscode.Webview, postCommand: CommandMessageSender, config: ConfigManager) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        changeDoc(postCommand, config, editor)
    })
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("io-runner")) {
            config.updateConfigs("extension")
            postCommand.init(config.extensionConfigs)
            changeDoc(postCommand, config, vscode.window.activeTextEditor)
        }
        if (e.affectsConfiguration("launch")) config.updateConfigs("launch")
        if (e.affectsConfiguration("tasks")) config.updateConfigs("task")
    })
}

const handleWebviewCommand = (view: vscode.Webview, postCommand: CommandMessageSender, config: ConfigManager) => {
    let runner: Runner
    recieveCommandFromView(view, {
        test: (data) => {
            vscode.window.showInformationMessage(data)
        },
        run: async ({ launchName, stdin }) => {
            const timeStart = performance.now()
            const targetLaunch = config.launchConfigs.get(launchName)
            if (!targetLaunch) {
                vscode.window.showErrorMessage(`Launch "${launchName}" not found!`)
                ViewContext.setRunning(false)
                postCommand.stopView()
                return
            }
            runner = new Runner(targetLaunch, stdin, config)
            runner.run()
            runner.on("stdout", (data) => {
                postCommand.stdout(data.buffer)
            })
            runner.on("end", ({ stdout, stderr, exitCode }) => {
                if (stderr) {
                    logger.showError(`STDERR: ${stderr}`)
                    ViewContext.setRunning(false)
                    postCommand.stopView()
                    return
                }
                const timeEnd = performance.now()
                postCommand.endRun({
                    stdout,
                    exitCode,
                    time: timeEnd - timeStart
                })
                ViewContext.setRunning(false)
            })
        },
        stop: async () => {
            await runner.stop()
            ViewContext.setRunning(false)
        }
    })
}
