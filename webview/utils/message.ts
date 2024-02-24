import type { WebviewApi } from "vscode-webview"
import type { Webview, Owner } from "..//types"

export type CommandSender = {
    [T in Webview.Command]:
        Webview.CommandData[T] extends undefined
            ? () => ReturnType<WebviewApi<unknown>["postMessage"]>
            : (data: Webview.CommandData[T]) => ReturnType<WebviewApi<unknown>["postMessage"]>
}

export const createCommandSender = (vscode: WebviewApi<unknown>) => new Proxy({} as CommandSender, {
    get: function <T extends Webview.Command>(_: CommandSender, command: T) {
        return (data: Webview.CommandData[T]) => vscode.postMessage({ command, data })
    }
})


export const recieveCommandFromOwner = <T extends Owner.Command>(event: MessageEvent<Owner.CommandMessage<T>>, onMessage: {
    [K in Owner.Command]: 
        Owner.CommandData[K] extends undefined 
            ? () => void 
            : (data: Owner.CommandData[K]) => void
}) => {
    const { data: message } = event
    console.assert(message.command in onMessage, `command ${message.command} not found`)
    const { command, data } = message
    onMessage[command](data)
}
