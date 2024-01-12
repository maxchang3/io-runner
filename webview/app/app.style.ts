import { css } from '@microsoft/fast-element'


export const styles = css`
    #app {
        display: flex;
        height: 100vh;
        justify-content: space-between;
        overflow: hidden;
    }

    .editor {
        width: 49%;
        height: 100%;
    }

    #selector {
        position: absolute;
        right: 19.5px;
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
