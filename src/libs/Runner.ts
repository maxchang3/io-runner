import { config } from "."
import { EventEmitter } from "node:stream"
import { executeProgram, executeTask, terminateTask } from "@/utils"
import type { ComputedLaunchConfiguration } from "@/types"
import type { ChildProcessWithoutNullStreams } from 'node:child_process'

enum RUNNER_STATUS {
    ready,
    preLaunchTask,
    running,
    postDebugTask,
}

type EventDataType = {
    end: {
        stdout: ArrayBuffer[]
        stderr: ArrayBuffer[]
        exitCode: number,
        isTimeout: boolean
    }
    stdout: Buffer
}

type EventListener<E extends keyof EventDataType> = (arg: EventDataType[E]) => void

export class Runner extends EventEmitter {
    private child?: ChildProcessWithoutNullStreams
    private status: RUNNER_STATUS = RUNNER_STATUS.ready
    private stdin: string
    private launchConfig: ComputedLaunchConfiguration
    private preLaunchTask?: string
    private postDebugTask?: string
    private timeout?: number
    constructor(launchConfig: ComputedLaunchConfiguration, stdin: string, timeout?: number) {
        super()
        this.launchConfig = launchConfig
        this.preLaunchTask = launchConfig.preLaunchTask
        this.postDebugTask = launchConfig.postDebugTask
        this.stdin = stdin
        this.timeout = timeout
    }
    public on<E extends keyof EventDataType>(eventName: E, listener: EventListener<E>) {
        return super.on(eventName, listener)
    }
    public emit<E extends keyof EventDataType>(eventName: E, arg: EventDataType[E]) {
        return super.emit(eventName, arg)
    }
    private checkStatus() { return this.status === RUNNER_STATUS.ready }
    private async runStep() {
        switch (this.status) {
            case RUNNER_STATUS.preLaunchTask:
                if (this.checkStatus()) return
                if (this.preLaunchTask) await executeTask(this.preLaunchTask)
                if (this.checkStatus()) return
                this.status = RUNNER_STATUS.running
                break
            case RUNNER_STATUS.running:
                if (this.checkStatus()) return
                const { program, cwd, args } = this.launchConfig.computeVariables()
                if (this.checkStatus()) return
                const [child, programExecution] = executeProgram(program, this.stdin, args, cwd, this.timeout)
                child.stdout.on("data", (data) => this.emit("stdout", data))
                if (this.checkStatus()) return
                this.child = child
                if (this.checkStatus()) return
                const { stdout, stderr, exitCode, isTimeout } = await programExecution
                if (this.checkStatus()) return
                this.emit("end", { stdout, stderr, exitCode, isTimeout })
                if (this.checkStatus()) return
                this.status = RUNNER_STATUS.postDebugTask
                break
            case RUNNER_STATUS.postDebugTask:
                if (this.checkStatus()) return
                if (this.postDebugTask) await executeTask(this.postDebugTask)
                this.status = RUNNER_STATUS.ready
                break
        }
    }
    public async run() {
        this.status = RUNNER_STATUS.preLaunchTask
        for (let i = 0; i < 4; i++) {
            if (this.checkStatus()) return
            await this.runStep()
        }
    }
    public async stop() {
        const taskConfigs = config.taskConfigs
        if (this.status === RUNNER_STATUS.preLaunchTask && this.preLaunchTask) {
            await terminateTask(this.preLaunchTask, taskConfigs?.get(this.preLaunchTask)?.dependsOn)
        } else if (this.status === RUNNER_STATUS.running) {
            this.child?.kill()
        } else if (this.status === RUNNER_STATUS.postDebugTask && this.postDebugTask) {
            await terminateTask(this.postDebugTask, taskConfigs?.get(this.postDebugTask)?.dependsOn)
        }
        this.status = RUNNER_STATUS.ready
    }
}
