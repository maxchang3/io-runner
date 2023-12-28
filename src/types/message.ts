import { IORunneronfig } from "./config"

export type CommandType = "init" | "run" | "stop" | "test"

export type CommandToDataType = {
    "init": IORunneronfig,
    "run": undefined,
    "stop": undefined,
    "test": string
}
export type CommandMessage = {
    command: CommandType
    data: CommandToDataType[CommandType]
}
