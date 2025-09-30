import {computed, onMounted, onUnmounted, Ref, ref, useTemplateRef, watch} from "vue"
import {IMacro, IMacroRecords} from "@/helpers/Macros/macros_interface.ts"
import {latex_macros} from "@/helpers/Macros/latex_macros.ts"
import {javascript_macros} from "@/helpers/Macros/javascript_macros.ts"
import {json_macros} from "@/helpers/Macros/json_macros.ts"
import {useMagicKeys, whenever} from "@vueuse/core"
import {greekLaTeX} from "@/helpers/greekLaTeX.ts"

type availableLanguageType = "latex" | "javascript" | "json"
const indentUnit = '\t' // 2 espaces
const invisibleCharacter = "‎"

const autoWrapMap: Record<string, (s: string) => string> = {
	'(': s => `(${s})`,
	'[': s => `[${s}]`,
	'{': s => `{${s}}`,
	'"': s => `"${s}"`,
	"'": s => `'${s}'`,
	'`': s => `\`${s}\``,
}

function isModifierKey(e: KeyboardEvent): boolean {
	return ['Alt', 'Control', 'Shift', 'Meta'].includes(e.key)
}

function getMacros(language: availableLanguageType): IMacroRecords {
	return language === 'javascript' ? javascript_macros :
		language === 'json' ? json_macros :
			latex_macros
}

function generateMacrosCharacters(
	macros: IMacroRecords
): { maxsize: number, characters: string[] } {

	const keys = [...Object.keys(macros)]
	const allCharacters = [...keys.map(key => key.split('')).flat()]

	return {
		maxsize: Math.max(0, ...keys.map(x => x.length)),
		characters: [...new Set(allCharacters)]
	}
}

export function useTextEditor(AreaRefName: string, options?: {
	language?: availableLanguageType,
	model?: Ref<string>,
	allowTab?: boolean
}) {
	const language = options?.language ?? 'latex'
	const macros = getMacros(language)

	// Configuration of the text editor
	const {
		maxsize: macroKeyMaxSize,
		characters: macrosCharacters
	} = generateMacrosCharacters(macros)

	const allowTab = ref(options?.allowTab ?? true)

	// Editor area and modelValue
	const textareaRef = useTemplateRef<HTMLTextAreaElement>(AreaRefName)
	const modelValue = options?.model ?? ref<string>("")

	function isTextareaFocused(): boolean {
		const el = textareaRef.value
		return el === document.activeElement
	}

	// Editor information
	// Last n characters
	const lastCharacters = ref<string[]>([])
	const lastKey = computed(() => {
		return lastCharacters.value.join('')
	})

	/** MathMode detection */
	const isInMathEnv = ref<boolean>(false)

	function checkIfInMathEnv() {
		const el = textareaRef.value
		if (!el) {
			return
		}

		const cursor = el.selectionStart
		const beforeCursor = el.value.slice(0, cursor)

		// Cherche les positions des dernières balises \(...\) et \[...\] avant le curseur
		const lastInlineStart = beforeCursor.lastIndexOf('\\(')
		const lastInlineEnd = beforeCursor.lastIndexOf('\\)')
		const lastDisplayStart = beforeCursor.lastIndexOf('\\[')
		const lastDisplayEnd = beforeCursor.lastIndexOf('\\]')

		const inInlineMath = lastInlineStart > lastInlineEnd
		const inDisplayMath = lastDisplayStart > lastDisplayEnd

		isInMathEnv.value = inInlineMath || inDisplayMath
	}

	/**
	 * Selection system
	 */
	const selectionStart = ref<number>(-1)
	const selectionEnd = ref<number>(-1)
	const currentSelectedText = computed(() => {
		const el = textareaRef.value
		return el?.value.slice(selectionStart.value, selectionEnd.value) ?? ''
	})

	function updateSelection() {
		const el = textareaRef.value
		if (el) {
			selectionStart.value = el.selectionStart
			selectionEnd.value = el.selectionEnd
		}
	}

	/**
	 * Current line
	 */
	const currentLine = ref<string>("")

	function updateCurrentLine() {
		const el = textareaRef.value
		const cursorPos = el.selectionStart
		const value = el.value

		// Trouver la position du dernier saut de ligne avant le curseur
		const before = value.lastIndexOf('\n', cursorPos - 1)
		// Trouver le prochain saut de ligne après le curseur
		const after = value.indexOf('\n', cursorPos)

		const start = before === -1 ? 0 : before + 1
		const end = after === -1 ? value.length : after

		currentLine.value = value.slice(start, end)
	}


	/**
	 * If it's a tab character:
	 * - there is a "tab stop" ? Go to the next one.
	 * - no "tab stop" ? add a \t character if allowTab
	 *
	 * If it's a wrap character (, [, {
	 * @param e
	 */
	function handleKeydown(e: KeyboardEvent) {
		const el = textareaRef.value

		if (e.key === 'Tab' && el.value.includes(invisibleCharacter)) {
			// Go to the next invisible character.
			e.preventDefault()
			goToNextTabStop(el)
		} else if (e.key === 'Tab' && allowTab.value) {
			e.preventDefault()
			const start = el.selectionStart
			const end = el.selectionEnd

			const value = el.value
			updateValue(value.substring(0, start) + '\t' + value.substring(end))
			el.selectionStart = el.selectionEnd = start + 1
		} else if (e.key === 'Enter') {
			e.preventDefault()
			indenter()
			removeTabStops()
		} else if (e.key === '}') {
			deindenter()
		} else if (e.key in autoWrapMap && el.selectionStart !== el.selectionEnd) {
			e.preventDefault()
			replaceSelectedText(autoWrapMap[e.key])
		}

		// Handle the last n keys.
		if (!isModifierKey(e)) {
			if (!macrosCharacters.includes(e.key)) {
				lastCharacters.value = []
				return
			}

			lastCharacters.value.push(e.key)
			if (lastCharacters.value.length > macroKeyMaxSize) {
				lastCharacters.value = lastCharacters.value.splice(-3)
			}

		}


	}

	function handleKeyup() {//e: KeyboardEvent
		checkIfInMathEnv()
		updateSelection()
		updateCurrentLine()
		return
	}

	function handleClick() { // e: MouseEvent
		checkIfInMathEnv()
		updateCurrentLine()
		removeTabStops()
		return
	}

	function handleInput(event: InputEvent) {
		const el = textareaRef.value
		if (!el) return

		if (greekMode.value) {
			// Reset greekmode.
			greekMode.value = false

			const greek = greekLaTeX[event.data]

			if (!greek) {
				// Not a greek letter
				return
			}

			const latex = isInMathEnv.value
				? greek
				: `\\( ${greek} \\) `

			const pos = el.selectionStart
			const result = el.value.slice(0, pos - 1)
				+ latex
				+ el.value.slice(pos)

			updateValue(result)

			el.selectionStart = el.selectionEnd = pos + latex.length - 1

			return
		}


		// const start = cursor - fullMatch.length
		// const end = cursor

		const macro = detectMacro()

		if (macro) {
			const {key, word, template, space} = macro

			let cursor = el.selectionStart

			let textBefore = el.value.slice(0, cursor - word.length - key.length)
			let textAfter = el.value.slice(cursor)

			// Update the text
			let result =
				(space ? trimEndSpace(textBefore) : textBefore) +
				applyTabStops(template, space) + // Replace all '@' by invisibleCharacter.
				(space ? trimStartSpace(textAfter) : textAfter)

			// Replace the first tab stop with the word
			if (word) {
				result = result.replace(invisibleCharacter, word)
			}

			// Update the textarea
			updateValue(result)

			// Select the first tab stop
			goToNextTabStop(el)

			// Reset the keys
			lastCharacters.value = []

			return
		}

		updateSelection()

		modelValue.value = el.value
	}

	function trimEndSpace(text: string) {
		return text.replace(/ +$/, '')
	}

	function trimStartSpace(text: string) {
		return text.replace(/^ +/, '')
	}

	function applyTabStops(template: string, space?: boolean): string {
		const el = textareaRef.value
		if (!el) return

		const spaceCharacter = space ? ' ' : ''
		const templateWithEnd = template.endsWith('@')
			? spaceCharacter + template + spaceCharacter
			: spaceCharacter + template + spaceCharacter + '@'

		// Remplace d'abord les @@ par un placeholder temporaire
		const placeholder = '__LITERAL_AT__'
		let result = templateWithEnd.replaceAll('@@', placeholder)

		// Remplace les @ restants par le caractère invisible
		result = result.replaceAll('@', invisibleCharacter)
		// Remet les @@ en @
		result = result.replaceAll(placeholder, '@')

		return result
	}

	function removeTabStops(): string {
		const el = textareaRef.value
		if (!el) return

		const {selectionStart, selectionEnd, value} = el

		// Compter les caractères invisibles avant et dans la sélection
		const before = value.slice(0, selectionStart)
		const selected = value.slice(selectionStart, selectionEnd)
		const after = value.slice(selectionEnd)

		const beforeClean = before.replaceAll(invisibleCharacter, '')
		const selectedClean = selected.replaceAll(invisibleCharacter, '')
		const afterClean = after.replaceAll(invisibleCharacter, '')

		const newValue = beforeClean + selectedClean + afterClean

		// Nouveaux index de sélection
		const newSelectionStart = beforeClean.length
		const newSelectionEnd = newSelectionStart + selectedClean.length

		updateValue(newValue)
		el.selectionStart = newSelectionStart
		el.selectionEnd = newSelectionEnd
	}

	function goToNextTabStop(el: HTMLTextAreaElement): boolean {
		const next = el.value.indexOf(invisibleCharacter)

		if (next != null) {
			// Remove this invisible character.
			const textBefore = el.value.slice(0, next)
			const textAfter = el.value.slice(next + 1)
			updateValue(textBefore + textAfter)
			el.selectionStart = el.selectionEnd = next
			return true
		}

		return false
	}

	function replaceSelectedText(transform: (text: string) => string) {
		const el = textareaRef.value
		if (!el) return

		const start = el.selectionStart
		const end = el.selectionEnd
		const selected = el.value.slice(start, end)
		const transformed = transform(selected)

		updateValue(el.value.slice(0, start) + transformed + el.value.slice(end))

		const newEnd = start + transformed.length
		el.selectionStart = start
		el.selectionEnd = newEnd

		updateSelection()
	}

	function detectMacro(): IMacro & { key: string, word: string } | undefined {
		const el = textareaRef.value
		if (!el) {
			return
		}

		// On teste tous les suffixes possibles de lastKey.value
		for (let i = 0; i < lastKey.value.length; i++) {
			const key = lastKey.value.slice(i)
			const macro = macros[key]

			if (
				macro &&
				macro.suffix &&
				(language !== 'latex' || macro.math === isInMathEnv.value)
			) {
				// On récupère le mot avant la macro suffixe
				const word = getWordBefore(el.value.slice(0, el.selectionStart - key.length)) ?? ''
				return {key, ...macro, word}
			}
		}

		// Sinon, on teste la macro "normale" (non suffix)
		const macro = macros[lastKey.value]
		if (
			macro &&
			!macro.suffix &&
			(language !== 'latex' || macro.math === isInMathEnv.value)
		) {
			return {key: lastKey.value, ...macro, word: ''}
		}

		return undefined
	}

	function getWordBefore(text: string) {
		const wordDelimiters = [
			'\\+', '-', '\\\\cdot', '\\\\\\(', '\\\\\\[', '\\s'
		]

		// On construit la regex de séparation
		const delimiterRegex = new RegExp(
			`(?:${wordDelimiters.join('|')})`
		)

		// On split le texte selon les séparateurs, puis on prend le dernier groupe non vide
		function getLastLatexGroup(txt: string): string | undefined {
			const parts = txt.split(delimiterRegex).filter(Boolean)
			return parts.length ? parts[parts.length - 1] : undefined
		}

		// Exemple d'utilisation
		return getLastLatexGroup(text)
	}

	function indenter() {
		const el = textareaRef.value

		const cursor = el.selectionStart
		let value = el.value

		// Trouver le début de la ligne courante
		const lineStart = value.lastIndexOf('\n', cursor - 1) + 1
		const line = value.slice(lineStart, cursor)
		const indentMatch = /^(\t*)/.exec(line)
		const currentIndent = indentMatch?.[1] ?? ''

		// est-ce une ligne d'ouverture ?
		const openBlock = /\\begin\{[^}]+}|{$/.test(line)

		const baseIndent = currentIndent + (openBlock ? '\t' : '')

		const newCursor = cursor + 1 + baseIndent.length

		updateValue(value.slice(0, cursor) + '\n' + baseIndent + value.slice(cursor))

		el.selectionStart = el.selectionEnd = newCursor
	}

	function deindenter() {
		const el = textareaRef.value

		const cursor = el.selectionStart
		let value = el.value

		// Trouver le début de la ligne courante
		const lineStart = value.lastIndexOf('\n', cursor - 1) + 1
		const line = value.slice(lineStart, cursor)

		// est-ce une ligne de fermeture ?
		const isCloseLine = /^\t+(\\end\{[^}]+)?/.test(line)

		if (!isCloseLine) {
			return
		}

		const textBefore = value.slice(0, lineStart)
		const textAfter = value.slice(lineStart + indentUnit.length)

		updateValue(textBefore + textAfter)
		el.selectionStart = el.selectionEnd = cursor - 1
	}

	function updateValue(value: string) {
		modelValue.value = value
		textareaRef.value.value = value
	}

	const {Ctrl_G, Ctrl_ArrowUp, Ctrl_ArrowDown} = useMagicKeys({
		passive: false,
		onEventFired(e) {
			if (e.ctrlKey && e.key === 'g' && e.type === 'keydown') {
				e.preventDefault()
				return
			}

			if (e.ctrlKey && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
				e.preventDefault()
				return
			}

		}
	})
	const greekMode = ref<boolean>(false)

	whenever(Ctrl_G, () => {
		if (isTextareaFocused()) {
			greekMode.value = true
		}
	})

	function changeParenthesisSize(direction: 'increase' | 'decrease') {
		// AI_CODE: merci l'IA
		const el = textareaRef.value
		if (!el) return

		const cursor = el.selectionStart
		const value = el.value

		const openChars = ['(', '[', '{', '\\lbrace']
		const closeChars = [')', ']', '}', '\\rbrace']

		// Cherche le prochain caractère ou séquence
		function getNextToken(value: string, cursor: number): string | undefined {
			for (const token of [...openChars, ...closeChars]) {
				if (value.slice(cursor, cursor + token.length) === token) {
					return token
				}
			}
			return undefined
		}

		const nextToken = getNextToken(value, cursor)
		const isOpen = openChars.includes(nextToken ?? '')
		const isClose = closeChars.includes(nextToken ?? '')
		if (!isOpen && !isClose) return

		const sizes = ['\\big', '\\Big', '\\left', '\\right'] //  '\\bigg', '\\Bigg'
		let found = -1

		for (let i = sizes.length - 1; i >= 0; i--) {
			const prefix = sizes[i]
			if (value.slice(cursor - prefix.length, cursor) === prefix) {
				found = i
				break
			}
		}

		let newPrefix = ''
		if (direction === 'increase') {
			if (found < sizes.length - 1 && found >= 0) {
				newPrefix = sizes[found + 1]
			} else if (found === -1) {
				newPrefix = sizes[0]
			} else {
				newPrefix = isOpen ? '\\left' : '\\right'
			}
		} else {
			if (found > 0) {
				newPrefix = sizes[found - 1]
			} else if (found === 0) {
				newPrefix = ''
			} else if (found === -1) {
				return // rien à réduire
			} else {
				newPrefix = ''
			}
		}

		let newValue
		let newCursor = cursor
		if (found >= 0) {
			newValue = value.slice(0, cursor - sizes[found].length) + newPrefix + value.slice(cursor)
			newCursor = cursor - sizes[found].length + newPrefix.length
		} else {
			newValue = value.slice(0, cursor) + newPrefix + value.slice(cursor)
			newCursor = cursor + newPrefix.length
		}

		updateValue(newValue)
		el.selectionStart = el.selectionEnd = newCursor
	}

	whenever(Ctrl_ArrowUp, () => {
		if (isTextareaFocused() && isInMathEnv.value) {
			changeParenthesisSize('increase')

		}
	})
	whenever(Ctrl_ArrowDown, () => {
		if (isTextareaFocused()) {
			changeParenthesisSize('decrease')
		}
	})

	watch(modelValue, (val) => {
		const el = textareaRef.value
		if (el && el.value !== val) {
			el.value = val
		}
	})

	onMounted(() => {
		const el = textareaRef.value
		if (el) {
			el.value = modelValue.value
			el.addEventListener('select', updateSelection)
			el.addEventListener('keydown', handleKeydown)
			el.addEventListener('keyup', handleKeyup)
			el.addEventListener('click', handleClick)
			el.addEventListener('input', handleInput)
		}
	})

	onUnmounted(() => {
		const el = textareaRef.value
		if (el) {
			el.removeEventListener('select', updateSelection)
			el.removeEventListener('keydown', handleKeydown)
			el.removeEventListener('keyup', handleKeyup)
			el.removeEventListener('click', handleClick)
			el.removeEventListener('input', handleInput)

		}
	})

	return {
		textareaValue: modelValue,
		textareaRef,
		selectionStart,
		selectionEnd,
		currentSelectedText,
		allowTab,
		updateSelection,
		replaceSelectedText,
		isInMathEnv,
		lastKey,
		currentLine
	}
}
