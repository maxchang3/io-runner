import type { commands } from 'vscode'

export type CommandParameters = Parameters<typeof commands.registerCommand>
