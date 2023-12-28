import { provideVSCodeDesignSystem, vsCodeDropdown, vsCodeOption } from "@vscode/webview-ui-toolkit"
import { vsCodeTextArea, vscodeTaskSelector } from "./ui/"
import type { taskSelector } from "./ui/"
/** @ts-ignore not so elegant :(  to be optimized */
import type { CommandMessage, CommandToDataType } from "../src/types"

provideVSCodeDesignSystem().register(
    vsCodeTextArea(),
    vsCodeDropdown(),
    vsCodeOption(),
    vscodeTaskSelector(),
)

const vscode = acquireVsCodeApi()

vscode.postMessage({ command: 'test' })

const elements = {
    taskSelector: undefined as taskSelector,
}

const setupMessageListener = () => {

    window.addEventListener('message', (event: MessageEvent<CommandMessage>) => {
        const message = event.data
        switch (message.command) {
            case 'init':
                {
                    const { taskMap } = (message.data) as CommandToDataType["init"]
                    console.log(message.data)
                    const q = taskMap['*.c']
                    elements.taskSelector.updateOptions(q)
                    break
                }
        }
    })

}

const main = () => {
    elements.taskSelector = document.querySelector("#selector") as taskSelector
    setupMessageListener()
}


window.addEventListener("load", main)
