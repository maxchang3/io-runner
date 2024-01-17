import { template } from "./app.template"
import { styles } from "./app.style"
import { postCommandToOwner, recieveCommandFromOwner } from "../utils/message"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TaskSelector } from "../components"
import type { Owner, IORunneronfig } from "../types"


export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl!: TaskSelector
    taskMap?: IORunneronfig["taskMap"]
    postCommand: ReturnType<typeof postCommandToOwner>
    constructor() {
        super()
        this.vscode = acquireVsCodeApi()
        this.postCommand = postCommandToOwner(this.vscode)
    }
    public connectedCallback() {
        super.connectedCallback()
        window.addEventListener('message', (e) => this.onVSCodeMessage(e))
        this.postCommand.test('test123')
    }
    onVSCodeMessage(event: MessageEvent<Owner.CommandMessage>) {
        return recieveCommandFromOwner(event, {
            init: (data) => {
                const { taskMap } = data
                this.taskMap = taskMap
                console.log(data)
            },
            changeDoc: (ext) => {
                if (!this.taskMap) throw new Error('taskMap is not initialized')
                this.taskSelectorEl.updateOptions(this.taskMap[ext] || [])
            },
            prepareRun: () => {
                if (!this.taskMap) throw new Error('taskMap is not initialized')
                const task = this.taskSelectorEl.current
                this.postCommand.run(task)
            }
        })
    }
}

export const app = App.compose<FoundationElementDefinition>({
    baseName: 'app',
    template,
    styles,
})
