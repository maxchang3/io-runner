import { EventEmitter } from "node:stream"
import { ConfigManager, executeProgram, executeTask, terminateTask } from "."
import type { ComputedLaunchConfiguration } from "@/types"
import type { ChildProcessWithoutNullStreams } from 'node:child_process'

type RunnerStatus = "ready" | "preLaunchTask" | "running" | "postDebugTask"

export class Runner extends EventEmitter {
    private child?: ChildProcessWithoutNullStreams
    private status: RunnerStatus = "ready"
    private stdin: string
    private launchConfig: ComputedLaunchConfiguration
    private preLaunchTask?: string
    private postLaunchTask?: string
    private configManager?: ConfigManager
    constructor(launchConfig: ComputedLaunchConfiguration, stdin: string, configManager: ConfigManager) {
        super()
        this.launchConfig = launchConfig
        this.preLaunchTask = launchConfig.preLaunchTask
        this.postLaunchTask = launchConfig.postLaunchTask
        this.stdin = stdin
        this.configManager = configManager
    }
    private checkStatus = () => (this.status as RunnerStatus === "ready")
    async runStep() {
        switch (this.status) {
            case "preLaunchTask":
                if (this.preLaunchTask) await executeTask(this.preLaunchTask)
                if (this.checkStatus()) return
                this.status = "running"
                break
            case "running":
                if (this.checkStatus()) return
                const { program, cwd, args } = this.launchConfig.computeVariables()
                if (this.checkStatus()) return
                const [child, programExecution] = executeProgram(program, this.stdin, args, cwd)
                if (this.checkStatus()) return
                this.child = child
                if (this.checkStatus()) return
                const { stdout, stderr, exitCode } = await programExecution
                if (this.checkStatus()) return
                this.emit("output", { stdout, stderr, exitCode })
                if (this.checkStatus()) return
                this.status = "postDebugTask"
                break
            case "postDebugTask":
                if (this.checkStatus()) return
                if (this.postLaunchTask) await executeTask(this.postLaunchTask)
                this.status = "ready"
                break
        }
    }
    async run() {
        this.status = "preLaunchTask"
        for (let i = 0; i < 4; i++) {
            if (this.checkStatus()) return
            await this.runStep()
        }
    }
    async stop() {
        const taskConfigs = this.configManager?.taskConfigs
        if (this.status === "preLaunchTask" && this.preLaunchTask) {
            await terminateTask(this.preLaunchTask, taskConfigs?.get(this.preLaunchTask)?.dependsOn)
        } else if (this.status === "running") {
            this.child?.kill()
        } else if (this.status === "postDebugTask" && this.postLaunchTask) {
            await terminateTask(this.postLaunchTask, taskConfigs?.get(this.postLaunchTask)?.dependsOn)
        }
        this.status = "ready"
    }
}