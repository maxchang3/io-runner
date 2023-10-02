// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
    FoundationElementDefinition,
    TextArea as FoundationTextArea,
    TextAreaResize,
} from '@microsoft/fast-foundation'
import { attr } from "@microsoft/fast-element"
import { textAreaStyles as styles } from './text-area.style'
import { textAreaTemplate as template } from './text-area.template'

export { TextAreaResize }

const countLines = (text: string) => text.length === 0 ? 0 : text.split('\n').length

/**
 * The Visual Studio Code text area class.
 *
 * @remarks
 * HTML Element: `<vscode-text-area>`
 *
 * @public
 */
export class TextArea extends FoundationTextArea {
    @attr
    public lines: number
    /**
     * Component lifecycle method that runs when the component is inserted
     * into the DOM.
     *
     * @internal
     */
    public connectedCallback() {
        super.connectedCallback()
        if (this.textContent) {
            this.setAttribute('aria-label', this.textContent)
        } else {
            // Describe the generic component if no label is provided
            this.setAttribute('aria-label', 'Text area')
        }
        this.lines = countLines(this.value)
    }
    valueChanged(previous: string, next: string) {
        if (!this.control) return
        this.lines = countLines(next)
    }
}

/**
 * The Visual Studio Code text area component registration.
 *
 * @remarks
 * HTML Element: `<vscode-text-area>`
 *
 * @public
 */
export const vsCodeTextArea = TextArea.compose<
    FoundationElementDefinition,
    typeof TextArea
>({
    baseName: 'text-area',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true,
    },
})
