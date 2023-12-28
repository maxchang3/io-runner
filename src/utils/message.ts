import type { CommandToDataType, CommandType } from "@/types"
import type { Webview } from "vscode"

export const postMessageToWebview = <T extends CommandType>(view: Webview, command: T, data: CommandToDataType[T]) => {
    view.postMessage({
        command,
        data
    })
}
