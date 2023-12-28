import { observable } from '@microsoft/fast-element'
import { FoundationElement, FoundationElementDefinition } from '@microsoft/fast-foundation'
import { styles } from "./task-selector.styles"
import { template } from "./task-selector.template"
import type { Dropdown } from "@vscode/webview-ui-toolkit"


export class taskSelector extends FoundationElement {
    dropdown: Dropdown
    @observable options: string[] = []
    get current() {
        return this.options[this.dropdown.selectedIndex]
    }
    updateOptions(options: string[]) {
        this.options = options
    }
}


export const vscodeTaskSelector = taskSelector.compose<FoundationElementDefinition>({
    baseName: 'task-selector',
    styles,
    template,
})
