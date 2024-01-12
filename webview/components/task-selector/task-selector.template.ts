import { html, repeat, ref } from '@microsoft/fast-element'
import { Dropdown, Option} from "@vscode/webview-ui-toolkit"
import type { TaskSelector } from '.'
import type { ElementDefinitionContext } from "@microsoft/fast-foundation"

export const template = (context: ElementDefinitionContext) => {
    const dropDownTag = context.tagFor(Dropdown)
    const optionTag = context.tagFor(Option)
    return html<TaskSelector>`
        <template>
        <${dropDownTag} ${ref("dropdown")} id="dropdown">
            ${repeat(x => x.options, html<string>`
                <${optionTag}>${x => x}</${optionTag}>
            `)}
        </${dropDownTag}>
        </template>
    `
}
