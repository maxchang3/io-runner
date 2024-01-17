import type { Webview } from "vscode"
import type { Owner, Webview as WebviewContext } from "@/types"

export type CommandMessageSender = {
    [T in Owner.Command]:
        Owner.CommandData[T] extends undefined
            ? () => ReturnType<Webview["postMessage"]>
            : (data: Owner.CommandData[T]) => ReturnType<Webview["postMessage"]>
}

export const postCommandToView = (view: Webview) => new Proxy({} as CommandMessageSender, {
    get: function <T extends Owner.Command>(_: CommandMessageSender, command: T) {
        return (data: Owner.CommandData[T]) => view.postMessage({ command, data })
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
