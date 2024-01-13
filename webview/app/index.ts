import { template } from "./app.template"
import { styles } from "./app.style"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TaskSelector } from "../components"
/** @ts-ignore not so elegant :(  to be optimized */
import type { CommandMessage, CommandDataType } from "../../src/types"

export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl: TaskSelector
    taskMap: CommandDataType["init"]["taskMap"]
    public connectedCallback() {
        super.connectedCallback()
        this.vscode = acquireVsCodeApi()
        window.addEventListener('message', (e) => this.onVSCodeMessage(e))
    }
    onVSCodeMessage(event: MessageEvent<CommandMessage>) {
        const message = event.data
        switch (message.command) {
            case 'init':
                {
                    const { taskMap } = (message.data) as CommandDataType["init"]
                    this.taskMap = taskMap
                    console.log(message.data)
                    break
                }
            case 'changeDoc':
                {
                    const ext = (message.data) as CommandDataType["changeDoc"]
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
