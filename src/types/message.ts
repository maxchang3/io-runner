import { IORunneronfig } from "./config"

type EnsureKeys<T extends Record<U, any>, U extends string> = U extends keyof T ? T : never

export type CommandType = "init" | "run" | "stop" | "test" | "changeDoc"

export type CommandToDataType = EnsureKeys<{
    init: IORunneronfig,
    run: undefined,
    stop: undefined,
    test: string,
    changeDoc: string
}, CommandType>

export type CommandMessage = {
    command: CommandType
    data: CommandToDataType[CommandType]
}
