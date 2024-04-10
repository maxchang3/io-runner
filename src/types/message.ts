import { IORunnerConfig } from "./config"


export namespace Owner {
    export type CommandData = {
        init: IORunnerConfig,
        changeDoc: {
            filename: string
            ext: string
        },
        stopView: undefined,
        prepareRun: undefined,
        prepareStop: undefined,
        endRun: {
            stdout: ArrayBuffer[]
            exitCode: number,
            time: number,
            isTimeout: boolean
        },
        stdout: ArrayBuffer
    }
    export type Command = keyof CommandData

    export type CommandMessage<K extends Command = Command> = {
        command: K
        data: CommandData[K]
    }

}

export namespace Webview {
    export type CommandData = {
        run: {
            launchName: string,
            stdin: string
        },
        stop: undefined,
        test: string,
    }

    export type Command = keyof CommandData

    export type CommandMessage<K extends Command = Command> = {
        command: K
        data: CommandData[K]
    }
}
