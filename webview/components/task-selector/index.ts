import { observable } from '@microsoft/fast-element'
import { FoundationElement, FoundationElementDefinition } from '@microsoft/fast-foundation'
import { styles } from "./task-selector.styles"
import { template } from "./task-selector.template"
import type { Dropdown } from "@vscode/webview-ui-toolkit"


export class TaskSelector extends FoundationElement {
    dropdown!: Dropdown
    @observable options: string[] = []
    get current() {
        return this.dropdown.currentValue
    }
    get selectedIndex() {
        return this.dropdown.selectedIndex
    }
    set selectedIndex(index: number) {
        this.dropdown.selectedIndex = index
    }
    updateOptions(options: string[]) {
        this.options = options
        if (this.options.length === 0) this.dropdown.currentValue = ""
    }
}


export const vscodeTaskSelector = TaskSelector.compose<FoundationElementDefinition>({
    baseName: 'task-selector',
    styles,
    template,
})
