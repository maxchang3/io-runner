import type { Webview } from "vscode"
import type { Owner, Webview as WebviewContext } from "@/types"

export type CommandMessageSender = {
    [T in Owner.Command]: (data: Owner.CommandData[T]) => ReturnType<Webview["postMessage"]>
}

export const postCommandToView = (view: Webview) => new Proxy({} as CommandMessageSender, {
    get: function (_, command: Owner.Command) {
        return (data: Owner.CommandData[typeof command]) => view.postMessage({ command, data })
    }
})


export const recieveCommandFromView = <T extends WebviewContext.Command>(view: Webview, onMessage: {
    [K in WebviewContext.Command]: (data: WebviewContext.CommandData[K]) => void
}) => {
    view.onDidReceiveMessage((message: WebviewContext.CommandMessage<T>) => {
        console.assert(message.command in onMessage, `command ${message.command} not found`)
        const { command, data } = message
        onMessage[command](data)
    })
}
