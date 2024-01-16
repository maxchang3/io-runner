import type { WebviewApi } from "vscode-webview"
/** @ts-ignore not so elegant :(  to be optimized */
import type { Webview } from "../../src/types"
import type { Owner } from "../../src/types"

export type CommandMessageSender = {
    [T in Webview.Command]: (data: Webview.CommandData[T]) => ReturnType<WebviewApi<unknown>["postMessage"]>
}

export const postCommandToVSCode = (vscode: WebviewApi<unknown>) => new Proxy({} as CommandMessageSender, {
    get: function (_, command: Webview.Command) {
        return (data: Webview.CommandData[typeof command]) => vscode.postMessage({ command, data })
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
