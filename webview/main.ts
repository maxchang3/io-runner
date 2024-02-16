import { provideVSCodeDesignSystem, vsCodeDropdown, vsCodeOption, vsCodeProgressRing } from "@vscode/webview-ui-toolkit"
import { vscodeTaskSelector, vscodeCodeMirror } from "./components"
import { app } from "./app/app"

provideVSCodeDesignSystem().register(
    vscodeCodeMirror(),
    vsCodeDropdown(),
    vsCodeOption(),
    vscodeTaskSelector(),
    vsCodeProgressRing(),
    app()
)
