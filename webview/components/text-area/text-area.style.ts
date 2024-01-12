// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { css } from '@microsoft/fast-element'
import { display, focusVisible } from '@microsoft/fast-foundation'
import {
	borderWidth,
	cornerRadius,
	designUnit,
	disabledOpacity,
	dropdownBorder,
	focusBorder,
	foreground,
	inputBackground,
	inputForeground,
	inputMinWidth,
	scrollbarHeight,
	scrollbarSliderActiveBackground,
	scrollbarSliderBackground,
	scrollbarSliderHoverBackground,
	scrollbarWidth,
	typeRampBaseFontSize,
	typeRampMinus1FontSize,
	typeRampPlus1FontSize,
	typeRampPlus1LineHeight,
} from '@vscode/webview-ui-toolkit/dist/design-tokens'
import type { ElementDefinitionContext, FoundationElementDefinition } from '@microsoft/fast-foundation'


const monospaceFontFamily = `Menlo, Monaco, "Courier New", monospace`

export const textAreaStyles = (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => css`
    ${display('inline-block')} :host {
        font-family: ${monospaceFontFamily};
        outline: none;
        user-select: none;
    }
    :host {
        width: 100%;
        height: 100%;
    }
    .control {
        box-sizing: border-box;
        position: relative;
        color: ${inputForeground};
        background: ${inputBackground};
        border-radius: calc(${cornerRadius} * 1px);
        border: calc(${borderWidth} * 1px) solid ${dropdownBorder};
        font: inherit;
        font-size: ${typeRampPlus1FontSize};
        line-height: ${typeRampPlus1LineHeight};
        padding: 0 calc(${designUnit} * 2px + 1px) 0 calc(${designUnit} * 2px + 1px);
        width: 100%;
        height: 100%;;
        min-width: ${inputMinWidth};
        resize: none;
        white-space: pre;
    }
    .control:hover:enabled {
        background: ${inputBackground};
        border-color: ${dropdownBorder};
    }
    .control:active:enabled {
        background: ${inputBackground};
        border-color: ${focusBorder};
    }
    .control:hover,
    .control:${focusVisible},
    .control:disabled,
    .control:active {
        outline: none;
    }
    .control::-webkit-scrollbar {
        width: ${scrollbarWidth};
        height: 0px;
    }
    .control::-webkit-scrollbar-corner {
        background: ${inputBackground};
    }
    .control::-webkit-scrollbar-thumb {
        background: ${scrollbarSliderBackground};
    }
    .control::-webkit-scrollbar-thumb:hover {
        background: ${scrollbarSliderHoverBackground};
    }
    .control::-webkit-scrollbar-thumb:active {
        background: ${scrollbarSliderActiveBackground};
    }
    :host(:focus-within:not([disabled])) .control {
        border-color: ${focusBorder};
    }
    :host([resize='both']) .control {
        resize: both;
    }
    :host([resize='horizontal']) .control {
        resize: horizontal;
    }
    :host([resize='vertical']) .control {
        resize: vertical;
    }
    .label-area {
        display: flex;
        justify-content: space-between;
    }
    .label {
        display: block;
        color: ${foreground};
        cursor: pointer;
        font-size: ${typeRampMinus1FontSize};
        line-height: ${typeRampPlus1LineHeight};
        margin-bottom: 2px;
    }
    .label__hidden {
        display: none;
        visibility: hidden;
    }
    .line-number-area {
        top: 0;
        position: relative;
        box-sizing: border-box;
        font: inherit;
        font-size: ${typeRampBaseFontSize};
        line-height: ${typeRampPlus1LineHeight};
		height: 100%;
        border: calc(${borderWidth} * 1px) solid transparent;
        overflow: hidden;
        color: var(--vscode-editorLineNumber-foreground);
        padding: 0 calc(${designUnit} * 2px + 1px) 0 calc(${designUnit} * 2px + 1px);
        text-align: right;
    }
    .line-number-area .active {
        color: var(--vscode-editorLineNumber-activeForeground);
    }
    .line-number-area::-webkit-scrollbar {
        display: none;
    }
    #container {
        display: flex;
        width: 100%;
        height: calc(100% - ${typeRampPlus1LineHeight} - 10px);
    }
    :host([disabled]) {
        opacity: ${disabledOpacity};
    }
    :host([disabled]) .control {
        border-color: ${dropdownBorder};
    }
`
