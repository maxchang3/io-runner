import * as vscode from "vscode"
import { Runner, config, logger } from "@/libs"
import { getCommandSender, recieveCommandFromView, ViewContext } from "@/utils"
import type { CommandMessageSender } from "@/utils"

const decoder = new TextDecoder(config.extensionConfigs.defaultEncoding)

const getFilenameAndExt = (editor?: vscode.TextEditor) => [editor?.document.fileName || "", editor?.document.fileName.split(".").pop() || ""] as const

const changeDoc = (commandSender: CommandMessageSender, editor?: vscode.TextEditor,) => {
    const [filename, ext] = getFilenameAndExt(editor)
    if (editor) commandSender.changeDoc({ filename, ext })
    ViewContext.setRunable(!!config.extensionConfigs.launchMap[ext])
}

export const init = async (view: vscode.Webview) => {
    const commandSender = getCommandSender(view)
    registerEvents(view, commandSender)
    handleWebviewCommand(view, commandSender)
    commandSender.init(config.extensionConfigs)
    changeDoc(commandSender, vscode.window.activeTextEditor)
}

const registerEvents = (
    view: vscode.Webview,
    commandSender: CommandMessageSender,
) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        changeDoc(commandSender, editor)
    })
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("io-runner")) {
            config.updateConfigs("extension")
            config.updateConfigs("launch")
            commandSender.init(config.extensionConfigs)
            changeDoc(commandSender, vscode.window.activeTextEditor)
        }
        if (e.affectsConfiguration("launch")) config.updateConfigs("launch")
        if (e.affectsConfiguration("tasks")) config.updateConfigs("task")
    })
}

const handleWebviewCommand = (
    view: vscode.Webview,
    commandSender: CommandMessageSender,
) => {
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
                commandSender.stopView()
                return
            }
            runner = new Runner(targetLaunch, stdin)
            runner.run()
            runner.on("stdout", (data) => {
                commandSender.stdout(data.buffer)
            })
            runner.on("end", ({ stdout, stderr, exitCode }) => {
                if (stderr.length !== 0) {
                    logger.showError(`STDERR: ${stderr.map(buffer => decoder.decode(buffer)).join("")}`)
                    ViewContext.setRunning(false)
                    commandSender.stopView()
                    return
                }
                const timeEnd = performance.now()
                commandSender.endRun({
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
