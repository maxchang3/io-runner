import { html, ref } from '@microsoft/fast-element'

import type { CodeMirror } from './codemirror'
import type { ElementDefinitionContext } from "@microsoft/fast-foundation"

export const template = (context: ElementDefinitionContext) => {
    return html<CodeMirror>`
        <template>
            <div class="label-area">
                <label
                    part="label"
                    for="control"
                    class="label"
                >
                    <slot name="label"></slot>
                </label>
            </div>
            <div
                part="control"
                class="control"
                id="control"
                ${ref("control")}
            ></div>
        </template>
    `
}
