import { App } from '.'
import { TextArea, TaskSelector } from '../components'
import { html, ref } from '@microsoft/fast-element'
import type { ElementDefinitionContext } from "@microsoft/fast-foundation"

export const template = (context: ElementDefinitionContext) => {
    const taskSelector = context.tagFor(TaskSelector)
    const textArea = context.tagFor(TextArea)

    return html<App>`
    <template>
        <div id="app">
            <${taskSelector} ${ref('taskSelectorEl')} id="selector"></${taskSelector}>
            <div class="editor input" >
                <${textArea} ${ref('inputEl')} resize="none" autofocus>
                    <div slot="label">INPUT</div>
                </${textArea}>
            </div>
            <div class="editor output" >
                <${textArea} ${ref('outputEl')}  resize="none" readonly>
                    <div slot="label">OUTPUT</div>
                </${textArea}>
            </div>
        </div>
    </template>
`
}
