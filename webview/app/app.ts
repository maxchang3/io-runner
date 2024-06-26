import { template } from "./app.template"
import { styles } from "./app.style"
import { attr } from "@microsoft/fast-element"
import { createCommandSender, recieveCommandFromOwner } from "../utils/message"
import { FoundationElement, FoundationElementDefinition } from "@microsoft/fast-foundation"
import type { CommandSender } from "../utils/message"
import type { WebviewApi } from "vscode-webview"
import type { TaskSelector, CodeMirror } from "../components"
import type { Owner, IORunnerConfig } from "../types"

const DEFAULT_STATE = { selectedTaskIndex: 0, input: "", output: "" }

export enum RUNNER_STATUS {
    ready,
    running
}

export class App extends FoundationElement {
    vscode: WebviewApi<unknown>
    decoder: TextDecoder
    taskSelectorEl!: TaskSelector
    inputEl!: CodeMirror
    outputEl!: CodeMirror
    launchMap?: IORunnerConfig["launchMap"]
    docState: Map<string, {
        selectedTaskIndex: number,
        input: string,
        output: string
    }> = new Map()
    lastFilename: string | undefined
    commandSender: CommandSender
    @attr status: RUNNER_STATUS = RUNNER_STATUS.ready
    constructor() {
        super()
        this.vscode = acquireVsCodeApi()
        this.commandSender = createCommandSender(this.vscode)
        this.decoder = new TextDecoder('utf-8')
    }
    public connectedCallback() {
        super.connectedCallback()
        window.addEventListener('message', (e) => this.onVSCodeMessage(e))
    }
    onVSCodeMessage(event: MessageEvent<Owner.CommandMessage>) {
        return recieveCommandFromOwner(event, {
            init: (data) => {
                const { launchMap, defaultEncoding } = data
                this.launchMap = launchMap
                if (defaultEncoding != "utf-8") this.decoder = new TextDecoder(defaultEncoding)
            },
            changeDoc: ({ filename, ext }) => {
                if (!this.launchMap) throw new Error('launchMap is not initialized')
                if (!this.lastFilename) {
                    this.taskSelectorEl.updateOptions(this.launchMap[ext] || [])
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
                this.taskSelectorEl.updateOptions(this.launchMap[ext] || [])
                this.taskSelectorEl.selectedIndex = selectedTaskIndex
                this.inputEl.value = input
                this.outputEl.value = output
                this.lastFilename = filename
            },
            prepareRun: () => {
                if (!this.launchMap) throw new Error('launchMap is not initialized')
                const launchName = this.taskSelectorEl.current
                const stdin = this.inputEl.value
                this.outputEl.value = ""
                this.status = RUNNER_STATUS.running
                this.commandSender.run({ launchName, stdin })
            },
            stopView: () => {
                this.status = RUNNER_STATUS.ready
            },
            prepareStop: () => {
                this.status = RUNNER_STATUS.ready
                this.commandSender.stop()
            },
            endRun: ({ stdout, exitCode, time, isTimeout }) => {
                this.status = RUNNER_STATUS.ready
                this.outputEl.value = stdout.map(buffer => this.decoder.decode(buffer)).join('')
                this.outputEl.insert(`\n--------\nexit with code ${exitCode} in ${((time) / 1000).toFixed(3)}s`)
                if (isTimeout) this.outputEl.insert(`\nexit with timeout`)
            },
            stdout: (data) => {
                if (this.status === RUNNER_STATUS.ready) return
                this.outputEl.insert(this.decoder.decode(data))
            }
        })
    }
}

export const app = App.compose<FoundationElementDefinition>({
    baseName: 'app',
    template,
    styles,
})
