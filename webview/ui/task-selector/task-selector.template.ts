import { html, repeat, ref } from '@microsoft/fast-element'
import { taskSelector } from './task-selector'
import { Dropdown, Option} from "@vscode/webview-ui-toolkit"
import type { ElementDefinitionContext } from "@microsoft/fast-foundation"

export const template = (context: ElementDefinitionContext) => {
    const dropDownTag = context.tagFor(Dropdown)
    const optionTag = context.tagFor(Option)
    return html<taskSelector>`
        <template>
        <${dropDownTag} ${ref("dropdown")} id="dropdown">
            ${repeat(x => x.options, html<string>`
                <${optionTag}>${x => x}</${optionTag}>
            `)}
        </${dropDownTag}>
        </template>
    `
}
