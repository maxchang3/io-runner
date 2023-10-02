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
	fontFamily,
	foreground,
	inputBackground,
	inputForeground,
	inputMinWidth,
	scrollbarHeight,
	scrollbarSliderActiveBackground,
	scrollbarSliderBackground,
	scrollbarSliderHoverBackground,
	scrollbarWidth,
	typeRampPlus1FontSize,
	typeRampPlus1LineHeight
} from '@vscode/webview-ui-toolkit/dist/design-tokens'
import type { ElementDefinitionContext, FoundationElementDefinition } from '@microsoft/fast-foundation'

export const textAreaStyles = (
	context: ElementDefinitionContext,
	definition: FoundationElementDefinition
) => css`
	${display('inline-block')} :host {
		font-family: ${fontFamily};
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
		padding: calc(${designUnit} * 2px + 1px);
		width: 100%;
        height: calc(100% - ${typeRampPlus1LineHeight} - 10px);;
		min-width: ${inputMinWidth};
		resize: none;
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
		height: ${scrollbarHeight};
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
		font-size: ${typeRampPlus1FontSize};
		line-height: ${typeRampPlus1LineHeight};
		margin-bottom: 2px;
	}
	.label__hidden {
		display: none;
		visibility: hidden;
	}
	:host([disabled]) {
		opacity: ${disabledOpacity};
	}
	:host([disabled]) .control {
		border-color: ${dropdownBorder};
	}
`
