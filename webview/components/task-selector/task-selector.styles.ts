import { css } from '@microsoft/fast-element'
import { inputHeight } from "@vscode/webview-ui-toolkit/dist/design-tokens"
export const styles = css`
    #dropdown {
        height: calc(${inputHeight} * 0.8);
    }
`
