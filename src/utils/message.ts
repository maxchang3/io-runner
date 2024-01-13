import type { Webview } from "vscode"
import type { CommandToDataType, CommandType } from "@/types"

export const postMessageToWebview = <T extends CommandType>(view: Webview, command: T, data: CommandToDataType[T]) => {
    return view.postMessage({
        command,
        data
    })
}
