import { provideVSCodeDesignSystem, vsCodeDropdown, vsCodeOption, vsCodeProgressRing } from "@vscode/webview-ui-toolkit"
import { vsCodeTextArea, vscodeTaskSelector } from "./components"
import { app } from "./app"

provideVSCodeDesignSystem().register(
    vsCodeTextArea(),
    vsCodeDropdown(),
    vsCodeOption(),
    vscodeTaskSelector(),
    vsCodeProgressRing(),
    app()
)
