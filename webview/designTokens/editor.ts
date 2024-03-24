import {
    create as createDesignToken
} from '@vscode/webview-ui-toolkit/dist/utilities/design-tokens/create'

export const editorFontFamily = createDesignToken(
    'editor-font-family',
    '--vscode-editor-font-family'
).withDefault('Consolas, "Courier New", monospace')

export const editorLineHighlightBorder = createDesignToken(
    'editor-lineHighlightBorder',
    '--vscode-editor-lineHighlightBorder'
).withDefault('#282828')

export const editorLineNumberForeground = createDesignToken(
    'editorLineNumber-foreground',
    '--vscode-editorLineNumber-foreground'
).withDefault('#6e7681')

export const editorLineNumberActiveForeground = createDesignToken(
    'editorLineNumber-activeForeground',
    '--vscode-editorLineNumber-activeForeground'
).withDefault('#cccccc')

export const selectionHighlightBackground = createDesignToken(
    'selectionHighlight-background',
    '--vscode-editor-selectionHighlightBackground'
).withDefault('rgba(173, 214, 255, 0.15)')
