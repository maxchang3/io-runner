import { IORunneronfig } from "./config"

export type CommandData = {
    init: IORunneronfig,
    run: undefined,
    stop: undefined,
    test: string,
    changeDoc: string
}

export type Command = keyof CommandData

export type CommandMessage = {
    command: Command
    data: CommandData[Command]
}
