import { provideVSCodeDesignSystem, vsCodeDropdown, vsCodeOption, vsCodeProgressRing } from "@vscode/webview-ui-toolkit"
import { vsCodeTextArea, vscodeTaskSelector, vscodeCodeMirror } from "./components"
import { app } from "./app/app"

provideVSCodeDesignSystem().register(
    vscodeCodeMirror(),
    vsCodeTextArea(),
    vsCodeDropdown(),
    vsCodeOption(),
    vscodeTaskSelector(),
    vsCodeProgressRing(),
    app()
)
