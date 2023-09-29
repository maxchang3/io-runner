import { defineConfig } from 'tsup'

export default defineConfig({
    entry: {
        extension: 'src/extension.ts',
        webview: "webview/main.ts"
    },
    format: ['cjs'],
    shims: false,
    dts: false,
    external: [
        'vscode',
    ],
    noExternal: [
        "@vscode/webview-ui-toolkit"
    ],
})
