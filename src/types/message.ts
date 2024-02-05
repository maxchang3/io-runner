import { IORunneronfig } from "./config"


export namespace Owner {
    export type CommandData = {
        init: IORunneronfig,
        changeDoc: {
            filename: string
            ext: string
        },
        prepareRun: undefined,
        prepareStop: undefined,
        endRun: {
            stdout: string
            exitCode: number,
            time: number
        },
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
