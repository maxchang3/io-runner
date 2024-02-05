import { template } from "./app.template"
import { styles } from "./app.style"
import { attr } from "@microsoft/fast-element"
import { postCommandToOwner, recieveCommandFromOwner } from "../utils/message"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { WebviewApi } from "vscode-webview"
import type { TextArea, TaskSelector } from "../components"
import type { Owner, IORunneronfig } from "../types"

const DEFAULT_STATE = { selectedTaskIndex: -1, input: "", output: "" }

export enum RUNNER_STATUS {
    ready,
    running
}

export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    taskSelectorEl!: TaskSelector
    inputEl!: TextArea
    outputEl!: TextArea
    taskMap?: IORunneronfig["taskMap"]
    docState: Map<string, {
        selectedTaskIndex: number,
        input: string,
        output: string
    }> = new Map()
    lastFilename: string | undefined
    postCommand: ReturnType<typeof postCommandToOwner>
    @attr status: RUNNER_STATUS = RUNNER_STATUS.ready
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
            },
            changeDoc: ({ filename, ext }) => {
                if (!this.taskMap) throw new Error('taskMap is not initialized')
                if (!this.lastFilename) {
                    this.taskSelectorEl.updateOptions(this.taskMap[ext] || [])
                    this.lastFilename = filename
                    return
                }
                const currentSelectedIndex = this.taskSelectorEl.selectedIndex
                const currentInput = this.inputEl.value
                const currentOutput = this.outputEl.value
                if (currentSelectedIndex || currentInput || currentOutput) {
                    this.docState.set(this.lastFilename, {
                        selectedTaskIndex: currentSelectedIndex,
                        input: currentInput,
                        output: currentOutput
                    })
                }
                const { selectedTaskIndex, input, output } = this.docState.get(filename) ?? DEFAULT_STATE
                this.taskSelectorEl.updateOptions(this.taskMap[ext] || [])
                this.taskSelectorEl.selectedIndex = selectedTaskIndex
                this.inputEl.value = input
                this.outputEl.value = output
                this.lastFilename = filename
            },
            prepareRun: () => {
                if (!this.taskMap) throw new Error('taskMap is not initialized')
                const launchName = this.taskSelectorEl.current
                const stdin = this.inputEl.value
                this.outputEl.value = ""
                this.status = RUNNER_STATUS.running
                this.postCommand.run({ launchName, stdin })
            },
            prepareStop: () => {
                this.status = RUNNER_STATUS.ready
                this.postCommand.stop()
            },
            endRun: ({ stdout, exitCode, time }) => {
                this.status = RUNNER_STATUS.ready
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
