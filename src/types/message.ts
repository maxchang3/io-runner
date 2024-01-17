import { IORunneronfig } from "./config"


export namespace Owner {
    export type CommandData = {
        init: IORunneronfig,
        changeDoc: string,
        prepareRun: undefined,
    }

    export type Command = keyof CommandData

    export type CommandMessage<K extends Command = Command> = {
        command: K
        data: CommandData[K]
    }

}

export namespace Webview {
    export type CommandData = {
        /** Task name to run */
        run: string,
        stop: undefined,
        test: string,
    }

    export type Command = keyof CommandData

    export type CommandMessage<K extends Command = Command> = {
        command: K
        data: CommandData[K]
    }
}
