import type { WebviewApi } from "vscode-webview"
import type { Webview, Owner } from "..//types"

export type CommandMessageSender = {
    [T in Webview.Command]:
        Webview.CommandData[T] extends undefined
            ? () => ReturnType<WebviewApi<unknown>["postMessage"]>
            : (data: Webview.CommandData[T]) => ReturnType<WebviewApi<unknown>["postMessage"]>
}

export const postCommandToOwner = (vscode: WebviewApi<unknown>) => new Proxy({} as CommandMessageSender, {
    get: function <T extends Webview.Command>(_: CommandMessageSender, command: T) {
        return (data: Webview.CommandData[T]) => vscode.postMessage({ command, data })
    }
})


export const recieveCommandFromOwner = <T extends Owner.Command>(event: MessageEvent<Owner.CommandMessage<T>>, onMessage: {
    [K in Owner.Command]: (data: Owner.CommandData[K]) => void
}) => {
    const { data: message } = event
    console.assert(message.command in onMessage, `command ${message.command} not found`)
    const { command, data } = message
    onMessage[command](data)
}
