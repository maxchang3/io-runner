import { template } from "./app.template"
import { styles } from "./app.style"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TaskSelector } from "../components"
/** @ts-ignore not so elegant :(  to be optimized */
import type { CommandMessage, CommandToDataType } from "../../src/types"

export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl: TaskSelector
    taskMap: CommandToDataType["init"]["taskMap"]
    public connectedCallback() {
        super.connectedCallback()
        this.vscode = acquireVsCodeApi()
        this.vscode.postMessage({ command: 'test' })
        window.addEventListener('message', (e) => this.onVSCodeMessage(e))
    }
    onVSCodeMessage(event: MessageEvent<CommandMessage>) {
        const message = event.data
        switch (message.command) {
            case 'init':
                {
                    const { taskMap } = (message.data) as CommandToDataType["init"]
                    this.taskMap = taskMap
                    console.log(message.data)
                    break
                }
            case 'changeDoc':
                {
                    const { ext } = (message.data) as CommandToDataType["changeDoc"]
                    this.taskSelectorEl.updateOptions(this.taskMap[`*.${ext}`])
                    break
                }
        }
    }
}

export const app = App.compose<FoundationElementDefinition>({
    baseName: 'app',
    template,
    styles,
})
