import { provideVSCodeDesignSystem } from "@vscode/webview-ui-toolkit"
import { vsCodeTextArea } from "./ui/text-area/text-area"

provideVSCodeDesignSystem().register(
    vsCodeTextArea(),
)

const vscode = acquireVsCodeApi()

vscode.postMessage({ command: 'test' })
