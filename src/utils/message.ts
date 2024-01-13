import type { Webview } from "vscode"
import type { CommandToDataType, CommandType } from "@/types"

export type CommandMessageSender = {
    [T in CommandType]: (data: CommandToDataType[T]) => ReturnType<Webview["postMessage"]>
}

export const postCommandToView = (view: Webview) => new Proxy({} as CommandMessageSender, {
    get: function (_, command: CommandType) {
        return (data: CommandToDataType[typeof command]) => view.postMessage({ command, data })
    }
})

