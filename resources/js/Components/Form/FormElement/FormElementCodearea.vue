<script lang="ts" setup>
import { javascriptTriggers, latexTriggers, mdTriggers, TriggerFunction } from "@/helpers/mdAutofill"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-latex"
import { computed, nextTick, onMounted, ref } from "vue"
import "prismjs/themes/prism.css"

/**
 * The value of the code area
 */
const theValue = defineModel<string>()

defineOptions({ inheritAttrs: false })

// Define the type of code (JS, LaTeX, JSON)
Prism.manual = true

// Expose the focus function
defineExpose({ focus: focusFn })

// Define the emits
// const emits = defineEmits(["update"])

// Define the props
const props = defineProps({
	rows: { type: [Number, String], default: 4 },
	focus: { type: Boolean, default: false },
	language: { type: String, default: "javascript" },
	wrap: { type: Boolean, default: true },
	resizeable: { type: Boolean, default: false },
	autoSize: { type: Boolean, default: false }
})

// Input component
const inp = ref(null)
// Pre component (for the highlighted code)
const pre = ref(null)

// number of rows
const currentRows = ref(0)

/**
 * Set the focus on the textarea
 * @param select (bool) if true, select the text
 */
function focusFn(select: boolean) {
	inp.value.focus()
	if (select === true) inp.value.select()
}

/**
 * Highlight the code using Prism.js
 */
const highlighted = computed(() => {
	if (theValue.value) {
		try {
			if (props.language.toLowerCase() === "latex") {
				return Prism.highlight(
					theValue.value,
					Prism.languages.latex,
					"latex"
				)
			}
			if (props.language.toLowerCase() === "json") {
				return Prism.highlight(
					theValue.value,
					Prism.languages.json,
					"json"
				)
			}
			return Prism.highlight(
				theValue.value,
				Prism.languages.javascript,
				"javascript"
			)
		} catch (e) {
			return theValue.value
		}
	}
	return ""
})

/**
 * Indent the code on enter
 * @param event
 */
function indenter(event: KeyboardEvent) {
	// The target is the textarea
	const target = event.target as HTMLTextAreaElement

	let text = theValue.value,
		originalSelectionStart = target.selectionStart,
		textStart = text.slice(0, originalSelectionStart),
		textEnd = text.slice(originalSelectionStart),
		startLines = textStart.split("\n"),
		currentLine = startLines.pop().trimEnd(),
		lastCharacter = currentLine[currentLine.length - 1],
		previousLine,
		lastPreviousCharacter = "",
		currentIndentLength = 0,
		index = 0

	if (startLines.length > 0) {
		previousLine = startLines.pop().trimEnd()
		lastPreviousCharacter = previousLine[previousLine.length - 1]
	}

	// Get the number of tab character at the beginning of the line.
	while (currentLine.charAt(index++) === "\t") {
		currentIndentLength++
	}

	if (["{", "(", "["].indexOf(lastCharacter) !== -1) {
		currentIndentLength++
	} else if (["}", ")", "]"].indexOf(lastCharacter) !== -1) {
		currentIndentLength--
	} else if (["+", "-", ".", ","].indexOf(lastCharacter) !== -1) {
		if (
			["+", "-", ".", ","].indexOf(lastPreviousCharacter) !==
			["+", "-", ".", ","].indexOf(lastCharacter)
		) {
			currentIndentLength++
		}
	}
	if (currentIndentLength < 0) {
		currentIndentLength = 0
	}

	// Add the return and optionaly the tab character
	theValue.value = `${textStart}\n${"\t".repeat(currentIndentLength)}${textEnd}`

	// Update the caret position on next update
	nextTick(() => {
		target.selectionEnd = target.selectionStart =
			originalSelectionStart + 1 + currentIndentLength
	})

}

/**
 * Add a tab character on tab key
 * @param event
 */
function tabber(event: KeyboardEvent) {
	// Target is the textarea
	const target = event.target as HTMLTextAreaElement

	/* enable tab character */
	const text = theValue.value,
		originalSelectionStart = target.selectionStart,
		textStart = text.slice(0, originalSelectionStart),
		textEnd = text.slice(originalSelectionStart)

	// Add the tab character
	theValue.value = `${textStart}\t${textEnd}`

	// Update the caret positoin on next update
	nextTick(() => {
		target.selectionEnd = target.selectionStart =
			originalSelectionStart + 1
	})
}

/**
 * Synchronize the scroll of the textarea and the pre
 */
function sync_scroll() {
	/* Scroll result to scroll coords of event - sync with textarea */
	pre.value.scrollTop = inp.value.scrollTop
	pre.value.scrollLeft = inp.value.scrollLeft
}

/**
 * Get the autofill triggers (2 or three letters) based on the language
 *
 */
function autofillTriggers(textStart: string) {
	if (props.language === "latex") {
		// must be in math mode
		if (
			textStart.split("\\(").length -
			textStart.split("\\)").length !== 1 &&
			textStart.split("\\[").length -
			textStart.split("\\]").length !== 1
		) {
			return mdTriggers
		} else {
			return latexTriggers
		}
	}

	if (props.language === "latex") {
		return latexTriggers
	} else if (props.language === "javascript") {
		return javascriptTriggers
	}
	return {}
}

// On keydown, grab the selected text.
// TODO: make a better "selectedText" to handle also wrapping with math attributes ?
const selectedText = ref("")

function grabSelectedText(event: KeyboardEvent) {
	const target = event.target as HTMLTextAreaElement
	const start = target.selectionStart,
		end = target.selectionEnd
	selectedText.value = theValue.value.slice(start, end)
}

/**
 * Autofill the code based on the triggers
 * @param event
 */
function autofill(event: KeyboardEvent) {
	// If the key is a wrapper key: (, [ or {
	if (["(", "[", "{"].indexOf(event.key) !== -1) {
		autofill_wrap(event)
		return
	}

	// Test the three letters triggers.
	const applied = autofill_do(event, 3)

	// Test the two letters triggers
	if (!applied) autofill_do(event, 2)
}

function autofill_wrap(event: KeyboardEvent) {
	if (selectedText.value === "") return

	// Get the target
	const target = event.target as HTMLTextAreaElement

	// Get the text before and after the caret
	const originalSelectionStart = target.selectionStart,
		textStart = theValue.value.slice(0, originalSelectionStart),
		textEnd = theValue.value.slice(originalSelectionStart)

	// Get the ending wrapper
	const wrapperEnd = event.key === "(" ? ")" : event.key === "[" ? "]" : "}"

	// Add the wrapper
	theValue.value = `${textStart}${selectedText.value}${wrapperEnd}${textEnd}`

	// Update the caret position on nextTick
	nextTick(() => {
		target.selectionEnd = target.selectionStart =
			originalSelectionStart + 1 + selectedText.value.length
	})
}

function autofill_do(event: KeyboardEvent, length: number) {
	// Get the input / textarea target
	const target = event.target as HTMLTextAreaElement

	// Get the text before and after the caret
	const originalSelectionStart = target.selectionStart,
		textStart = theValue.value.slice(0, originalSelectionStart),
		textEnd = theValue.value.slice(originalSelectionStart),
		trigger = textStart.slice(-length)

	const autofillTrigger = autofillTriggers(textStart)

	// // In LaTeX mode, we must be in math mode
	// if (props.language === "latex") {
	// 	// must be in math mode
	// 	if (
	// 		textStart.split("\\(").length -
	// 		textStart.split("\\)").length !== 1 &&
	// 		textStart.split("\\[").length -
	// 		textStart.split("\\]").length !== 1
	// 	) {
	// 		return false
	// 	}
	// }

	// Test the trigger
	if (Object.hasOwn(autofillTrigger, trigger)) {
		let pos = 0
		if (typeof autofillTrigger[trigger] === "function") {
			const [txt1, txt2] = (autofillTrigger[trigger] as TriggerFunction)(
				textStart,
				textEnd
			)
			theValue.value = `${txt1}${txt2}`
			pos = txt1.length
		} else {
			// It's a code action.
			theValue.value = `${textStart.slice(
				0,
				textStart.length - trigger.length
			)}${autofillTrigger[trigger][0]}${autofillTrigger[trigger][1]
				}${textEnd}`
			pos = target.selectionStart =
				originalSelectionStart +
				autofillTrigger[trigger][0].length -
				trigger.length
		}

		// Update the caret position on nextTick
		nextTick(() => {
			target.selectionEnd = pos
		})

		// Trigger applied
		return true
	}

	// No trigger found
	return false
}

/**
 * Synchronise the front and back textarea scroll position
 */
function update() {
	sync_scroll()
}


/**
 * Update the height of the textarea to fit the content
 */
const areaHeight = computed(() => {
	const r = +props.rows > 0 ? +props.rows: (theValue.value ?? "").split("\n").length + 2
	return `${0.5 + Math.max(+currentRows.value, r) * 1.4 + 0.5}rem`
})

/**
 * On mounted, set the focus if asked
 * and update the height to fit everything.
 */
onMounted(() => {
	if (props.focus) focus()

	// Modify the height to fit everything.
	// currentRows.value = Math.max(
	// 	(theValue.value ?? "").split("\n").length + 2,
	// 	+props.rows
	// )
})
</script>
<template>
	<div class="w-full">
		<div
			:class="props.wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'"
			class="tracking-normal font-normal code-input border language-javascript text-[1.1em] transition-all"
		>
			<textarea
				ref="inp"
				v-model="theValue"
				:autofocus="props.focus"
				class="w-full"
				v-bind="$attrs"
				@input="update"
				@keydown="grabSelectedText"
				@keyup="autofill"
				@scroll="sync_scroll"
				@keydown.tab.prevent="tabber"
				@keydown.enter.prevent="indenter"
			/>
			<pre ref="pre"><code
				class="w-full"
				v-html="highlighted"
			/></pre>
		</div>

		<div
			v-if="resizeable"
			class="flex justify-center w-full mt-2"
		>
			<button
				class="text-xs"
				@click="currentRows += 10"
			>
				<i class="bi bi-textarea-resize mr-2" /> agrandir
			</button>
		</div>
	</div>
</template>

<style scoped>
.code-input {
	/* Allow other elems to be inside */
	position: relative;
	top: 0;
	left: 0;
	display: block;
	/* Only scroll inside elems */
	overflow: hidden;

	/* Normal inline styles */
	padding: 0;
	margin: 0;
	width: 100%;
	min-height: v-bind(areaHeight);
	/*height: 250px;*/

	/*font-size: inherit;*/
	font-family: monospace;
	line-height: inherit;
	tab-size: 2;
	caret-color: darkgrey;
}

.code-input textarea,
.code-input pre {
	/* Both elements need the same text and space styling so they are directly on top of each other */
	margin: 0 !important;
	padding: 0.6rem !important;
	border: 0;
	width: 100%;
	height: 100%;
	white-space: inherit;
}

.code-input textarea,
.code-input pre,
.code-input pre * {
	/* Also add text styles to highlighing tokens */
	font-size: inherit !important;
	font-family: inherit !important;
	line-height: inherit !important;
	tab-size: inherit !important;
}

.code-input textarea,
.code-input pre {
	/* In the same place */
	position: absolute;
	top: 0;
	left: 0;
}

/* Move the textarea in front of the result */
.code-input textarea {
	z-index: 1;
}

.code-input pre {
	z-index: 0;
}

/* Make textarea almost completely transparent */
.code-input textarea {
	color: transparent;
	background: transparent;
	caret-color: inherit !important;
	/* Or choose your favourite color */
}

/* Can be scrolled */
.code-input textarea,
.code-input pre {
	overflow: auto !important;
	white-space: inherit;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
}

/* No resize on textarea; stop outline */
.code-input textarea {
	resize: none;
	outline: none !important;
}
</style>
