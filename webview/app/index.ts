import { template } from "./app.template"
import { styles } from "./app.style"
import { postCommandToOwner, recieveCommandFromOwner } from "../utils/message"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TaskSelector } from "../components"
import type { Owner } from "../types"

export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl: TaskSelector
    taskMap: Owner.CommandData["init"]["taskMap"]
    public connectedCallback() {
        super.connectedCallback()
        this.vscode = acquireVsCodeApi()
        window.addEventListener('message', (e) => this.onVSCodeMessage(e))
        postCommandToOwner(this.vscode).test('test123')
    }
    onVSCodeMessage(event: MessageEvent<Owner.CommandMessage>) {
        return recieveCommandFromOwner(event, {
            init: (data) => {
                const { taskMap } = (data)
                this.taskMap = taskMap
                console.log(data)
            },
            changeDoc: (ext) => {
                this.taskSelectorEl.updateOptions(this.taskMap[ext])

            }
        })
    }
}

export const app = App.compose<FoundationElementDefinition>({
    baseName: 'app',
    template,
    styles,
})
