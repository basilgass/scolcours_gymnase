import {EditorView, keymap, showTooltip} from "@codemirror/view"
import {EditorSelection, type Extension, Prec, StateEffect, StateField} from "@codemirror/state"
import {insertTab} from "@codemirror/commands"
import {javascriptLanguage} from "@codemirror/lang-javascript"
import type {IMacroRecords} from "@/helpers/Macros/macros_interface.ts"
import {latex_macros} from "@/helpers/Macros/latex_macros.ts"
import {javascript_macros} from "@/helpers/Macros/javascript_macros.ts"
import {json_macros} from "@/helpers/Macros/json_macros.ts"
import {greekLaTeX} from "@/helpers/greekLaTeX.ts"
import {getSignatureTooltip, pimathCompletionSource} from "@/helpers/pimath_completions.ts"
import {type CompletionGroup, makeCompletionSource} from "@/helpers/codemirror_completion.ts"

const signatureHelpField = StateField.define({
	create: (state) => getSignatureTooltip(state),
	update(tooltip, tr) {
		if (!tr.docChanged && !tr.selection) return tooltip
		return getSignatureTooltip(tr.state)
	},
	provide: f => showTooltip.from(f)
})

const signatureTheme = EditorView.baseTheme({
	'.cm-signature-help': {
		padding: '2px 10px',
		fontFamily: 'monospace',
		fontSize: '0.82em',
		opacity: '0.9',
	}
})

const IC = "\u200E" // U+200E invisible tab-stop marker (same as useTextEditor)

// ── Math environment detection (text-based, identical to original checkIfInMathEnv) ──

function isInMath(state: import("@codemirror/state").EditorState): boolean {
	const pos = state.selection.main.head
	const before = state.doc.sliceString(0, pos)
	return before.lastIndexOf('\\(') > before.lastIndexOf('\\)') ||
		before.lastIndexOf('\\[') > before.lastIndexOf('\\]')
}

// ── Greek mode state ──

const setGreek = StateEffect.define<boolean>()
export const greekModeField = StateField.define<boolean>({
	create: () => false,
	update: (v, tr) => {
		for (const e of tr.effects) if (e.is(setGreek)) return e.value
		return v
	}
})

// ── Tab stop utilities ──

function applyTabStops(template: string, space?: boolean): string {
	const sp = space ? ' ' : ''
	const t = template.endsWith('@') ? `${sp}${template}${sp}` : `${sp}${template}${sp}@`
	return t.replaceAll('@@', '\x00').replaceAll('@', IC).replaceAll('\x00', '@')
}

// ── Word extraction (identical logic to original getWordBefore) ──

function getWordBefore(text: string): string {
	if (text.at(-1) === ' ') return ''
	const parts = text.split(/(?:\+|-|\\cdot|\\\(|\\\[|\s)/).filter(Boolean)
	return parts.at(-1) ?? ''
}

// ── Macro utilities ──

function getMacros(language: string): IMacroRecords {
	if (language === 'javascript') return javascript_macros
	if (language === 'json') return json_macros
	if (language === 'pidraw' || language === 'pidraw-params') return {}
	return latex_macros
}

function macroCharInfo(macros: IMacroRecords) {
	const keys = Object.keys(macros)
	return {
		maxSize: Math.max(0, ...keys.map(k => k.length)),
		chars: new Set(keys.flatMap(k => [...k]))
	}
}

// ── Extension factory ──

export function useCodeMirrorExtensions(
	language: 'latex' | 'json' | 'javascript' | 'pidraw' | 'pidraw-params',
	completionGroups?: CompletionGroup[]
): Extension[] {
	const macros = getMacros(language)
	const {chars: macroChars} = macroCharInfo(macros)

	// ── Greek handler (runs before macro handler) ──
	const greekHandler = EditorView.inputHandler.of((view, from, to, text) => {
		if (!view.state.field(greekModeField)) return false

		const greek = greekLaTeX[text]
		if (!greek) {
			// Not a greek letter: insert char normally but skip macro detection
			view.dispatch({
				changes: {from, to, insert: text},
				selection: EditorSelection.cursor(from + text.length),
				effects: setGreek.of(false)
			})
			return true
		}

		const insert = isInMath(view.state) ? greek : `\\( ${greek} \\) `
		view.dispatch({
			changes: {from, to, insert},
			selection: EditorSelection.cursor(from + insert.length),
			effects: setGreek.of(false)
		})
		return true
	})

	// ── Macro handler ──
	const macroHandler = EditorView.inputHandler.of((view, from, to, text) => {
		if (text.length !== 1) return false // skip pastes
		if (from !== to) return false       // skip selection replacements

		const docBefore = view.state.doc.sliceString(0, from)
		const inMath = isInMath(view.state)

		// Build candidate: last run of macro-chars in doc + the new char
		let i = docBefore.length
		while (i > 0 && macroChars.has(docBefore[i - 1])) i--
		const candidate = docBefore.slice(i) + text

		interface Found {
			key: string;
			word: string;
			keyInDocLen: number;
			template: string;
			space?: boolean;
			suffix?: boolean
		}

		let found: Found | null = null

		// Suffix macros first
		for (let s = 0; s < candidate.length && !found; s++) {
			const key = candidate.slice(s)
			const macro = macros[key]
			if (!macro?.suffix) continue
			if (macro.math !== undefined && macro.math !== inMath) continue
			const keyInDocLen = key.length - 1 // 1 char (text) not yet in doc
			const word = getWordBefore(docBefore.slice(0, from - keyInDocLen))
			found = {key, word, keyInDocLen, template: macro.template, space: macro.space}
		}

		// Regular macros
		for (let s = 0; s < candidate.length && !found; s++) {
			const key = candidate.slice(s)
			const macro = macros[key]
			if (!macro || macro.suffix) continue
			if (macro.math !== undefined && macro.math !== inMath) continue
			found = {key, word: '', keyInDocLen: key.length - 1, template: macro.template, space: macro.space}
		}

		if (!found) return false

		const {key, word, keyInDocLen, template, space} = found
		let processed = applyTabStops(template, space)
		if (word) processed = processed.replace(IC, word)

		// First tab stop becomes cursor position (remove it from insert text)
		const icIdx = processed.indexOf(IC)
		const insertText = icIdx >= 0 ? processed.slice(0, icIdx) + processed.slice(icIdx + 1) : processed
		const cursorOffset = icIdx >= 0 ? icIdx : processed.length

		let changeFrom = from - word.length - keyInDocLen
		let changeTo = from

		if (space) {
			while (changeFrom > 0 && docBefore[changeFrom - 1] === ' ') changeFrom--
			const after = view.state.doc.sliceString(from, from + 10)
			let sp = 0
			while (sp < after.length && after[sp] === ' ') sp++
			changeTo = from + sp
		}

		view.dispatch({
			changes: {from: changeFrom, to: changeTo, insert: insertText},
			selection: EditorSelection.cursor(changeFrom + cursorOffset)
		})
		return true
	})

	// ── Tab stop navigation ──
	function jumpToTabStop(view: EditorView): boolean {
		const pos = view.state.doc.toString().indexOf(IC)
		if (pos < 0) return false
		view.dispatch({
			changes: {from: pos, to: pos + 1, insert: ''},
			selection: EditorSelection.cursor(pos)
		})
		return true
	}

	// ── Enter: auto-indent + clear all tab stops ──
	function enterIndent(view: EditorView): boolean {
		const state = view.state
		const pos = state.selection.main.head
		const line = state.doc.lineAt(pos)
		const lineText = line.text.slice(0, pos - line.from)
		const baseIndent = (/^(\t*)/.exec(lineText)?.[1] ?? '') +
			(/\\begin\{[^}]+\}|\{$/.test(lineText) ? '\t' : '')

		const fullDoc = state.doc.toString()
		const changes: { from: number; to: number; insert: string }[] = []
		let offset = 0
		while (true) {
			const idx = fullDoc.indexOf(IC, offset)
			if (idx < 0) break
			changes.push({from: idx, to: idx + 1, insert: ''})
			offset = idx + 1
		}
		changes.push({from: pos, to: pos, insert: '\n' + baseIndent})

		const removedBefore = (fullDoc.slice(0, pos).match(new RegExp(IC, 'g')) ?? []).length
		view.dispatch({
			changes,
			selection: EditorSelection.cursor(pos - removedBefore + 1 + baseIndent.length)
		})
		return true
	}

	// ── Deindent on } ──
	function deindentBrace(view: EditorView): boolean {
		const state = view.state
		const pos = state.selection.main.head
		const line = state.doc.lineAt(pos)
		if (!/^\t+/.test(line.text.slice(0, pos - line.from))) return false
		view.dispatch({
			changes: [
				{from: line.from, to: line.from + 1, insert: ''},
				{from: pos, to: pos, insert: '}'}
			],
			selection: EditorSelection.cursor(pos)
		})
		return true
	}

	// ── Parenthesis size (Ctrl+ArrowUp/Down) ──
	function parenSize(view: EditorView, dir: 'up' | 'down'): boolean {
		if (!isInMath(view.state)) return false
		const pos = view.state.selection.main.head
		const doc = view.state.doc.toString()

		const opens = ['(', '[', '{', '\\lbrace']
		const closes = [')', ']', '}', '\\rbrace']
		const token = [...opens, ...closes].find(t => doc.slice(pos, pos + t.length) === t)
		if (!token) return false

		const sizes = ['\\big', '\\Big', '\\left', '\\right']
		let found = -1
		for (let i = sizes.length - 1; i >= 0; i--) {
			if (doc.slice(pos - sizes[i].length, pos) === sizes[i]) {
				found = i
				break
			}
		}

		let newPrefix: string
		if (dir === 'up') {
			if (found === -1) newPrefix = sizes[0]
			else if (found < sizes.length - 1) newPrefix = sizes[found + 1]
			else newPrefix = opens.includes(token) ? '\\left' : '\\right'
		} else {
			if (found === -1) return false
			newPrefix = found === 0 ? '' : sizes[found - 1]
		}

		const prefixStart = found >= 0 ? pos - sizes[found].length : pos
		view.dispatch({
			changes: {from: prefixStart, to: pos, insert: newPrefix},
			selection: EditorSelection.cursor(prefixStart + newPrefix.length)
		})
		return true
	}

	const pimathExtension = language === 'javascript'
		? [
			javascriptLanguage.data.of({autocomplete: pimathCompletionSource}),
			signatureHelpField,
			signatureTheme,
		]
		: []

	const customCompletionExtension = (language === 'javascript' && completionGroups && completionGroups.length > 0)
		? [javascriptLanguage.data.of({autocomplete: makeCompletionSource(completionGroups)})]
		: []

	return [
		greekModeField,
		greekHandler,
		macroHandler,
		...pimathExtension,
		...customCompletionExtension,
		Prec.highest(keymap.of([
			{key: "Tab", run: (v) => jumpToTabStop(v) || insertTab(v)},
			{key: "Enter", run: enterIndent},
			{key: "}", run: deindentBrace},
			{
				key: "Ctrl-g", run: (v) => {
					v.dispatch({effects: setGreek.of(true)})
					return true
				}
			},
			{key: "Ctrl-ArrowUp", run: (v) => parenSize(v, 'up')},
			{key: "Ctrl-ArrowDown", run: (v) => parenSize(v, 'down')},
		]))
	]
}
