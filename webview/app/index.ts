import { template } from "./app.template"
import { styles } from "./app.style"
import { postCommandToOwner, recieveCommandFromOwner } from "../utils/message"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TextArea, TaskSelector } from "../components"
import type { Owner, IORunneronfig } from "../types"


export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl!: TaskSelector
    inputEl!: TextArea
    outputEl!: TextArea
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
                const launchName = this.taskSelectorEl.current
                const stdin = this.inputEl.value
                this.postCommand.run({ launchName, stdin })
            },
            stdout: ({ stdout, exitCode, time }) => {
                this.outputEl.value = `${stdout}\n--------\nexit with code ${exitCode} in ${((time) / 1000).toFixed(3)}s`
            }
        })
    }
}

export const app = App.compose<FoundationElementDefinition>({
    baseName: 'app',
    template,
    styles,
})
