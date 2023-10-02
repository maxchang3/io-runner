import { html, ref, slotted } from "@microsoft/fast-element"
import { TextAreaResize } from "./text-area"
import type { ViewTemplate } from "@microsoft/fast-element"
import type { FoundationElementTemplate } from "@microsoft/fast-foundation"
import type { TextArea } from "./text-area"

/**
 * The template for the {@link @microsoft/fast-foundation#(TextArea:class)} component.
 * Customed for Judge Runner 
 * @public
 */
export const textAreaTemplate: FoundationElementTemplate<ViewTemplate<TextArea>> =
    (context, definition) => html`
    <template
        class="
            ${x => (x.readOnly ? "readonly" : "")}
            ${x => (x.resize !== TextAreaResize.none ? `resize-${x.resize}` : "")}"
    >
        <div class="label-area">
            <label
                part="label"
                for="control"
                class="${x => x.defaultSlottedNodes && x.defaultSlottedNodes.length ? "label" : "label label__hidden"}"
            >
                <slot ${slotted("defaultSlottedNodes")}></slot>
            </label>
            <label
                part="label"
                for="control"
                class="label"
            >
                LINE: ${x => x.lines}
            </label>
        </div>
        <textarea
            part="control"
            class="control"
            id="control"
            ?autofocus="${x => x.autofocus}"
            cols="${x => x.cols}"
            ?disabled="${x => x.disabled}"
            form="${x => x.form}"
            list="${x => x.list}"
            maxlength="${x => x.maxlength}"
            minlength="${x => x.minlength}"
            name="${x => x.name}"
            placeholder="${x => x.placeholder}"
            ?readonly="${x => x.readOnly}"
            ?required="${x => x.required}"
            rows="${x => x.rows}"
            ?spellcheck="${x => x.spellcheck}"
            :value="${x => x.value}"
            aria-atomic="${x => x.ariaAtomic}"
            aria-busy="${x => x.ariaBusy}"
            aria-controls="${x => x.ariaControls}"
            aria-current="${x => x.ariaCurrent}"
            aria-describedby="${x => x.ariaDescribedby}"
            aria-details="${x => x.ariaDetails}"
            aria-disabled="${x => x.ariaDisabled}"
            aria-errormessage="${x => x.ariaErrormessage}"
            aria-flowto="${x => x.ariaFlowto}"
            aria-haspopup="${x => x.ariaHaspopup}"
            aria-hidden="${x => x.ariaHidden}"
            aria-invalid="${x => x.ariaInvalid}"
            aria-keyshortcuts="${x => x.ariaKeyshortcuts}"
            aria-label="${x => x.ariaLabel}"
            aria-labelledby="${x => x.ariaLabelledby}"
            aria-live="${x => x.ariaLive}"
            aria-owns="${x => x.ariaOwns}"
            aria-relevant="${x => x.ariaRelevant}"
            aria-roledescription="${x => x.ariaRoledescription}"
            @input="${(x, c) => x.handleTextInput()}"
            @change="${x => x.handleChange()}"
            ${ref("control")}
        ></textarea>
    </template>
`