import * as vscode from "vscode"
import { Runner, config, logger } from "@/libs"
import { postCommandToView, recieveCommandFromView, ViewContext } from "@/utils"
import type { CommandMessageSender } from "@/utils"
import { TextDecoder } from "util"

const getFilenameAndExt = (editor?: vscode.TextEditor) => [editor?.document.fileName || "", editor?.document.fileName.split(".").pop() || ""] as const

const changeDoc = (postCommand: CommandMessageSender, editor?: vscode.TextEditor,) => {
    const [filename, ext] = getFilenameAndExt(editor)
    if (editor) postCommand.changeDoc({ filename, ext })
    ViewContext.setRunable(!!config.extensionConfigs.launchMap[ext])
}

export const init = async (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    const decoder = new TextDecoder(config.extensionConfigs.defaultEncoding)
    registerEvents(view, postCommand)
    handleWebviewCommand(view, postCommand, decoder)
    postCommand.init(config.extensionConfigs)
    changeDoc(postCommand, vscode.window.activeTextEditor)
}

const registerEvents = (
    view: vscode.Webview,
    postCommand: CommandMessageSender,
) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        changeDoc(postCommand, editor)
    })
    vscode.workspace.onDidChangeConfiguration((e) => {
        if (e.affectsConfiguration("io-runner")) {
            config.updateConfigs("extension")
            config.updateConfigs("launch")
            postCommand.init(config.extensionConfigs)
            changeDoc(postCommand, vscode.window.activeTextEditor)
        }
        if (e.affectsConfiguration("launch")) config.updateConfigs("launch")
        if (e.affectsConfiguration("tasks")) config.updateConfigs("task")
    })
}

const handleWebviewCommand = (
    view: vscode.Webview,
    postCommand: CommandMessageSender,
    decoder: TextDecoder
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
                postCommand.stopView()
                return
            }
            runner = new Runner(targetLaunch, stdin)
            runner.run()
            runner.on("stdout", (data) => {
                postCommand.stdout(data.buffer)
            })
            runner.on("end", ({ stdout, stderr, exitCode }) => {
                if (stderr.length !== 0) {
                    logger.showError(`STDERR: ${stderr.map(buffer => decoder.decode(buffer)).join("")}`)
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
