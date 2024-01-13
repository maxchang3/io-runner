import type { Webview } from "vscode"
import type { CommandData, Command } from "@/types"

export type CommandMessageSender = {
    [T in Command]: (data: CommandData[T]) => ReturnType<Webview["postMessage"]>
}

export const postCommandToView = (view: Webview) => new Proxy({} as CommandMessageSender, {
    get: function (_, command: Command) {
        return (data: CommandData[typeof command]) => view.postMessage({ command, data })
    }
})

