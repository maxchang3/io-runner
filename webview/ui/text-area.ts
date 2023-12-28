// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
    FoundationElementDefinition,
    TextArea as FoundationTextArea,
    TextAreaResize,
} from '@microsoft/fast-foundation'
import { textAreaStyles as styles } from './text-area.style'
import { textAreaTemplate as template } from './text-area.template'
export { TextAreaResize }

const debounce = <T extends (...args: any[]) => any>(cb: T, wait: number) => {
    let h: any
    const callable = (...args: any) => {
        clearTimeout(h)
        h = setTimeout(() => cb(...args), wait)
    }
    return <T>(<any>callable)
}

/**
 * The Visual Studio Code text area class with line number.
 *
 * @remarks
 * HTML Element: `<vscode-text-area>`
 *
 * @public
 */
export class TextArea extends FoundationTextArea {
    lines: number
    lineNumber: HTMLDivElement
    private preCursorLine: number = 1
    /**
     * Detects if the component has been resized
     * @from @fast-foundation/src/horizontal-scroll/horizontal-scroll.ts
     * @internal
     */
    private resizeDetector: ResizeObserver | null = null;
    private debouncedUpdateLineNumber = debounce(() => this.updateLineNumber(), 50)
    /**
     * Component lifecycle method that runs when the component is inserted
     * into the DOM.
     *
    * @internal
     */
    public connectedCallback() {
        super.connectedCallback()
        this.initializeResizeDetector()
        if (this.textContent) {
            this.setAttribute('aria-label', this.textContent)
        } else {
            // Describe the generic component if no label is provided
            this.setAttribute('aria-label', 'Text area')
        }
        this.lines = this.countLines(this.value)
        requestAnimationFrame(() => this.updateLineNumber())
    }
    /**
     * destroys the instance's resize observer
     * @from @fast-foundation/src/horizontal-scroll/horizontal-scroll.ts
     * @internal
     */
    private disconnectResizeDetector(): void {
        if (this.resizeDetector) {
            this.resizeDetector.disconnect()
            this.resizeDetector = null
        }
    }
    /**
     * @from @fast-foundation/src/horizontal-scroll/horizontal-scroll.ts
     */
    public disconnectedCallback(): void {
        this.disconnectResizeDetector()
        super.disconnectedCallback()
    }
    /**
     * @from @fast-foundation/src/horizontal-scroll/horizontal-scroll.ts
     */
    private initializeResizeDetector(): void {
        this.disconnectResizeDetector()
        this.resizeDetector = new window.ResizeObserver(this.resized.bind(this))
        this.resizeDetector.observe(this)
    }
    private countLines(text: string) {
        return text.length === 0 ? 0 : text.split('\n').length
    }
    private updateLineNumber() {
        const lineHeight = parseFloat(window.getComputedStyle(this.control).lineHeight)
        const visibleLines = Math.floor(this.control.clientHeight / lineHeight)
        const requiredLines = Math.max(this.lines, visibleLines)
        while (this.lineNumber.children.length > requiredLines) {
            this.lineNumber.removeChild(this.lineNumber.lastChild)
        }
        while (this.lineNumber.children.length < requiredLines) {
            this.lineNumber.appendChild(document.createElement('div'))
        }
    }
    private handleCursorMove() {
        const cursorLine = this.control.value.substring(0, this.control.selectionStart).split(/\r?\n/).length
        const lastLineEl = this.lineNumber.children[this.preCursorLine - 1]
        lastLineEl && lastLineEl.classList.remove("active")
        this.lineNumber.children[cursorLine - 1].classList.add('active')
        this.preCursorLine = cursorLine
    }
    valueChanged(_previous: string, next: string) {
        if (!this.control) return
        const preLines = this.lines
        this.lines = this.countLines(next)
        if (preLines !== this.lines) {
            this.updateLineNumber()
            this.handleCursorMove()
        }
    }
    handleTextAreaScroll() {
        this.lineNumber.scrollTop = this.control.scrollTop
    }
    handleKeydown(e: KeyboardEvent) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            this.handleCursorMove()
        }
        return true
    }
    resized() {
        this.debouncedUpdateLineNumber()
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
