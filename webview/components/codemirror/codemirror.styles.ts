import {
   disabledCursor,
   focusVisible,
} from '@microsoft/fast-foundation'
import {
   background,
   borderWidth,
   buttonPrimaryBackground,
   buttonPrimaryForeground,
   buttonPrimaryHoverBackground,
   cornerRadiusRound,
   disabledOpacity,
   dropdownBorder,
   focusBorder,
   fontFamily,
   foreground,
   inputBackground,
   inputForeground,
   listActiveSelectionBackground,
   scrollbarHeight,
   scrollbarSliderActiveBackground,
   scrollbarSliderBackground,
   scrollbarSliderHoverBackground,
   scrollbarWidth,
   typeRampBaseFontSize,
   typeRampBaseLineHeight,
   typeRampMinus1FontSize,
   typeRampPlus1FontSize,
   typeRampPlus1LineHeight,
} from '@vscode/webview-ui-toolkit/dist/design-tokens'
import {
   editorFontFamily,
   editorLineHighlightBorder,
   editorLineNumberActiveForeground,
   editorLineNumberForeground,
   selectionHighlightBackground
} from '../../designTokens/editor'
import { css } from '@microsoft/fast-element'
export const styles = css`
   :host {
      font-family: ${editorFontFamily} !important;
      width: 100%;
      height: 100%;
   }
   .label-area {
      display: flex;
      justify-content: space-between;
   }
   .label {
      display: block;
      color: ${foreground};
      background: ${background};
      cursor: pointer;
      font-size: ${typeRampMinus1FontSize};
      line-height: ${typeRampPlus1LineHeight};
      margin-bottom: 2px;
   }
   #control {
      height: 87%;
      background: ${background} !important;
      border: calc(${borderWidth} * .5px) solid ${dropdownBorder};
   }
   .cm-line,
   .cm-scroller {
      font-family: ${editorFontFamily} !important;
   }
   .cm-scroller::-webkit-scrollbar {
        width: ${scrollbarWidth};
        height: ${scrollbarHeight};
   }
   .cm-scroller::-webkit-scrollbar-corner {
       background: ${inputBackground};
   }
   .cm-scroller::-webkit-scrollbar-thumb {
       background: ${scrollbarSliderBackground};
   }
   .cm-scroller::-webkit-scrollbar-thumb:hover {
       background: ${scrollbarSliderHoverBackground};
   }
   .cm-scroller::-webkit-scrollbar-thumb:active {
       background: ${scrollbarSliderActiveBackground};
   }
   .cm-cursor, 
   .cm-dropCursor {
      border-left-color: #f2f2f2 !important;
   }
   .cm-editor {
      font-family: ${editorFontFamily} !important;
      height: 100%;
      max-height: 100% !important;
      position: relative !important;
      box-sizing: border-box;
      display: flex !important;
      flex-direction: column;
   }
   .cm-content {
      font-size: ${typeRampPlus1FontSize} !important;
   }
   .cm-wrap {
      border: 1px solid silver;
   }
   .cm-activeLine {
      border-top: 1px solid ${editorLineHighlightBorder} !important;
      border-bottom: 1px solid ${editorLineHighlightBorder} !important;
      background: transparent !important;
   }
   .cm-gutters {
      font-size: ${typeRampBaseFontSize} !important;
      background: ${background} !important;
      color: ${editorLineNumberForeground} !important;
      border-right: 0px !important;
   }
   .cm-gutterElement {
      background: ${background} !important;
   }
   .cm-activeLineGutter {
      color: ${editorLineNumberActiveForeground} !important;
   }
   .cm-editor .cm-focused .cm-selectionBackground,
   .cm-selectionBackground,
   .cm-content ::selection { 
      border-radius: 3px;
      background-color: ${listActiveSelectionBackground} !important;
   }
   .cm-selectionMatch {
      background-color: ${selectionHighlightBackground} !important;
   }
   .cm-panel {
      user-select: none;
      background: ${background};
      color: ${foreground};
   }
   .cm-button {
      border: none !important;
      outline: none !important;
      font-family: ${fontFamily} !important;
      font-size: ${typeRampMinus1FontSize} !important;
      line-height: ${typeRampBaseLineHeight} !important;
      color: ${buttonPrimaryForeground} !important;
      background: ${buttonPrimaryBackground} !important;
      border-radius: calc(${cornerRadiusRound} * 1px) !important;
      fill: currentColor !important;
      cursor: pointer !important;
   }
   .cm-button:hover {
        background: ${buttonPrimaryHoverBackground} !important;
   }
   .cm-button:active {
        background: ${buttonPrimaryBackground} !important;
   }
   .cm-button:${focusVisible} {
        outline: calc(${borderWidth} * 1px) solid ${focusBorder} !important;
        outline-offset: calc(${borderWidth} * 2px)!important;
   }
   .cm-button::-moz-focus-inner {
        border: 0 !important;
   }
   .cm-button[disabled] {
        opacity: ${disabledOpacity}!important;
        background: ${buttonPrimaryBackground}!important;
        cursor: ${disabledCursor}!important;
   }
   .cm-panel.cm-search input {
      background: ${inputBackground} !important;
      color: ${inputForeground}!important;
   }
   .cm-panels-bottom {
      border: calc(${borderWidth} * .5px) solid ${dropdownBorder} !important;
   }
   .cm-textfield {
        font-size: ${typeRampMinus1FontSize} !important;
        -webkit-appearance: none !important;
        background: transparent !important;
        color: inherit !important;
        margin-top: auto !important;
        margin-bottom: auto !important;
        border-radius: calc(${cornerRadiusRound} * 1px);
        border: calc(${borderWidth} * 1px) solid ${dropdownBorder} !important;
    }
    .cm-textfield:hover,
    .cm-textfield:${focusVisible},
    .cm-textfield:disabled,
    .cm-textfield:active {
        outline: none !important;
    }
   .cm-textfield:hover:not([disabled]) {
		background: ${inputBackground} !important;
		border-color: ${dropdownBorder} !important;
	}
	.cm-textfield:active:not([disabled]) {
		background: ${inputBackground} !important;
		border-color: ${focusBorder} !important;
	}
   .cm-textfield:focus-within:not([disabled]){
		border-color: ${focusBorder} !important;
	}
   .cm-panel.cm-search [name="close"] {
      cursor: pointer;
      color: ${foreground};
   }
`
