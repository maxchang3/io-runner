import { EditorState } from "@codemirror/state"
import { EditorView } from "@codemirror/view"
import { basicSetup } from '@uiw/codemirror-extensions-basic-setup'
import { styles } from "./codemirror.styles"
import { template } from "./codemirror.template"
import { FoundationElement, FoundationElementDefinition } from '@microsoft/fast-foundation'

export class CodeMirror extends FoundationElement {
    control!: HTMLDivElement
    view!: EditorView
    connectedCallback() {
        super.connectedCallback()
        const state = EditorState.create({
            extensions: [
                basicSetup({
                    autocompletion: false,
                }),
                EditorState.readOnly.of(this.getAttribute('readonly') === '')
            ],
        })
        this.view = new EditorView({
            state,
            parent: this.control
        })
        if (this.autofocus) this.view.focus()
    }
    insert(value: string) {
        this.view.dispatch({
            changes: { from: this.view.state.doc.length, insert: value }
        })
    }
    set value(value: string) {
        this.view.dispatch({
            changes: { from: 0, to: this.view.state.doc.length, insert: value }
        })
    }
    get value() {
        return this.view.state.doc.toString()
    }

}

export const vscodeCodeMirror = CodeMirror.compose<FoundationElementDefinition>({
    baseName: 'codemirror',
    styles,
    template,
})
