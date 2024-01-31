import { css } from '@microsoft/fast-element'
import { designUnit, inputHeight, inputMinWidth } from '@vscode/webview-ui-toolkit/dist/design-tokens'


export const styles = css`
    #app {
        display: flex;
        height: 100vh;
        justify-content: space-between;
    }
    .editor {
        width: 49%;
        height: 100%;
    }
    #tool {
        position: absolute;
        right: 19.5px;
    }
    .tool-container {
        display: flex;
        align-items: center;
    }
    .hidden {
        display: none;
    }
    #progress {
        width: calc(${inputHeight} * 0.7px);
        height: calc(${inputHeight} * 0.7px);
        margin-right: calc(${designUnit} * 1.5px);
    }

    @media screen and (max-width: 500px) {
        #app {
            flex-direction: column;
        }

        .editor {
            width: 100%;
            height: 50%;
        }
    }
`
