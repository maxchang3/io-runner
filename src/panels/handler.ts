import * as vscode from "vscode"
import {
    resolveConfig,
    postCommandToView,
    recieveCommandFromView,
    getLaunchConfig,
    execProgram,
    executeTask,
} from "@/utils"
import type { CommandMessageSender } from "@/utils"

const getFilenameExt = (editor?: vscode.TextEditor) => editor?.document.fileName.split(".").pop() || ""

export const init = async (view: vscode.Webview) => {
    const postCommand = postCommandToView(view)
    registerEvents(view, postCommand)
    handleWebviewCommand(view, postCommand)
    const config = resolveConfig()
    postCommand.init(config)
    const ext = getFilenameExt(vscode.window.activeTextEditor)
    postCommand.changeDoc(ext)
}

const registerEvents = (view: vscode.Webview, postCommand: CommandMessageSender) => {
    vscode.window.onDidChangeActiveTextEditor(editor => {
        const ext = getFilenameExt(editor)
        if (ext) postCommand.changeDoc(ext)
    })
}

const handleWebviewCommand = (view: vscode.Webview, postCommand: CommandMessageSender) => {
    recieveCommandFromView(view, {
        test: (data) => {
            vscode.window.showInformationMessage(data)
        },
        run: async ({ launchName, stdin }) => {
            const timeStart = performance.now()
            const targetLaunch = getLaunchConfig(launchName)
            if (!targetLaunch) throw new Error(`Launch "${launchName}" not found`)
            const { preLaunchTask, postDebugTask } = await targetLaunch.computedTasks
            if (preLaunchTask) await executeTask(preLaunchTask)
            const { program, args, cwd } = targetLaunch.computeVariables()
            if (!program) throw new Error(`Launch program is not defined`)
            const { stdout, stderr, exitCode } = await execProgram(program, stdin, args, cwd)
            if (stderr) throw new Error(`${stderr}`)
            const timeEnd = performance.now()
            postCommand.stdout({
                stdout,
                exitCode,
                time: timeEnd - timeStart
            })
            vscode.commands.executeCommand('setContext', 'io-runner.running', false)
            if (postDebugTask) await executeTask(postDebugTask)
        },
        stop: () => {
            vscode.window.showInformationMessage('stop')
        }
    })
}
