import { IORunneronfig } from "./config"

export type CommandDataType = {
    init: IORunneronfig,
    run: undefined,
    stop: undefined,
    test: string,
    changeDoc: string
}

export type CommandType = keyof CommandDataType

export type CommandMessage = {
    command: CommandType
    data: CommandDataType[CommandType]
}
