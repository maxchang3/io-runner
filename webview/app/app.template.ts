import { App, RUNNER_STATUS } from '.'
import { TextArea, TaskSelector } from '../components'
import { ProgressRing } from '@vscode/webview-ui-toolkit'
import { html, ref } from '@microsoft/fast-element'
import type { ElementDefinitionContext } from "@microsoft/fast-foundation"

export const template = (context: ElementDefinitionContext) => {
    const taskSelector = context.tagFor(TaskSelector)
    const textArea = context.tagFor(TextArea)
    const progressRing = context.tagFor(ProgressRing)

    return html<App>`
    <template>
        <div id="app">
            <div id="tool">
               <div class="tool-container">
                    <${progressRing} id="progress" class="${x => x.status === RUNNER_STATUS.ready ? "hidden" : ""}"></${progressRing}>
                    <${taskSelector} ${ref('taskSelectorEl')} id="selector"></${taskSelector}>
                </div>
            </div>
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
