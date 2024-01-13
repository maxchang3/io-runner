import type { Webview } from "vscode"
import type { CommandDataType, CommandType } from "@/types"

export type CommandMessageSender = {
    [T in CommandType]: (data: CommandDataType[T]) => ReturnType<Webview["postMessage"]>
}

export const postCommandToView = (view: Webview) => new Proxy({} as CommandMessageSender, {
    get: function (_, command: CommandType) {
        return (data: CommandDataType[typeof command]) => view.postMessage({ command, data })
    }
})

