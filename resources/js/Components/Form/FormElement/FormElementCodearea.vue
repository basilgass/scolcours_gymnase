<script setup>
import { computed, onMounted, ref } from "vue"

import Prism from "prismjs"
import "prismjs/themes/prism.css"
import "prismjs/components/prism-latex"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import { javascriptTriggers, latexTriggers } from "@/helpers/mdAutofill"

defineOptions({
		inheritAttrs: false,
	})
	Prism.manual = true

	defineExpose({ focus: focusFn })
	const emits = defineEmits(["update:modelValue", "update"])
	const props = defineProps({
			modelValue: { type: String, default: "" },
			rows: { type: Number, default: 4 },
			focus: { type: Boolean, default: false },
			language: { type: String, default: "javascript" },
			wrap: { type: Boolean, default: true },
			resizeable: { type: Boolean, default: false },
			autoSize: { type: Boolean, default: false },
		}),
		theValue = ref(props.modelValue)

	let inp = ref(null),
		currentRows = ref(props.rows)

	function focusFn(select) {
		inp.value.focus()
		if (select === true) {
			inp.value.select()
		}
	}

	let pre = ref(null),
		highlighted = computed(() => {
			if (theValue.value) {
				try {
					if (props.language.toLowerCase() === "latex") {
						return Prism.highlight(
							theValue.value,
							Prism.languages.latex,
							"latex",
						)
					}
					if (props.language.toLowerCase() === "json") {
						return Prism.highlight(
							theValue.value,
							Prism.languages.json,
							"json",
						)
					}
					return Prism.highlight(
						theValue.value,
						Prism.languages.javascript,
						"javascript",
					)
				} catch (e) {
					return theValue.value
				}
			}
			return ""
		}),
		indenter = function (event) {
			let text = theValue.value,
				originalSelectionStart = event.target.selectionStart,
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

			theValue.value = `${textStart}\n${"\t".repeat(
				currentIndentLength,
			)}${textEnd}`
			event.target.value = theValue.value // required to make the cursor stay in place.
			event.target.selectionEnd = event.target.selectionStart =
				originalSelectionStart + 1 + currentIndentLength
		},
		tabber = function (event) {
			/* enable tab caracter */
			let text = theValue.value,
				originalSelectionStart = event.target.selectionStart,
				textStart = text.slice(0, originalSelectionStart),
				textEnd = text.slice(originalSelectionStart)

			theValue.value = `${textStart}\t${textEnd}`
			event.target.value = theValue.value // required to make the cursor stay in place.
			event.target.selectionEnd = event.target.selectionStart =
				originalSelectionStart + 1
		},
		sync_scroll = function () {
			/* Scroll result to scroll coords of event - sync with textarea */
			pre.value.scrollTop = inp.value.scrollTop
			pre.value.scrollLeft = inp.value.scrollLeft
		},
		autofillTriggers = computed(() => {
			if (props.language === "latex") {
				return latexTriggers
			} else if (props.language === "javascript") {
				return javascriptTriggers
			}
			return {}
		}),
		autofill = function (event) {
			// Test the three letters triggers.
			let applied = autofill_do(event, 3)

			if (!applied) {
				autofill_do(event, 2)
			}
		},
		autofill_do = function (event, length) {
			let originalSelectionStart = event.target.selectionStart,
				textStart = theValue.value.slice(0, originalSelectionStart),
				textEnd = theValue.value.slice(originalSelectionStart),
				trigger = textStart.slice(-length)

			if (props.language === "latex") {
				// must be in math mode
				if (
					textStart.split("\\(").length -
						textStart.split("\\)").length !==
						1 &&
					textStart.split("\\[").length -
						textStart.split("\\]").length !==
						1
				) {
					return false
				}
			}
			if (Object.hasOwn(autofillTriggers.value, trigger)) {
				let pos = 0
				if (typeof autofillTriggers.value[trigger] === "function") {
					const [txt1, txt2] = autofillTriggers.value[trigger](
						textStart,
						textEnd,
					)
					theValue.value = `${txt1}${txt2}`
					pos = txt1.length
				} else {
					// It's a code action.
					theValue.value = `${textStart.slice(
						0,
						textStart.length - trigger.length,
					)}${autofillTriggers.value[trigger][0]}${
						autofillTriggers.value[trigger][1]
					}${textEnd}`
					pos = event.target.selectionStart =
						originalSelectionStart +
						autofillTriggers.value[trigger][0].length -
						trigger.length
				}

				// Update the caret position
				event.target.value = theValue.value
				event.target.selectionEnd = pos
				return true
			}
			return false
		}
	const update = () => {
		sync_scroll()
		emits("update:modelValue", theValue)
		emits("update", theValue.value)
	}
	const areaHeight = computed(() => {
		const r = (theValue.value??"").split("\n").length + 2
		return `${0.5 + Math.max(currentRows.value, r) * 1.4 + 0.5}rem`
	})
	onMounted(() => {
		if (props.focus) focus(false)

		// Modify the height to fit everything.
		currentRows.value = Math.max(
			(theValue.value??"").split("\n").length + 2,
			props.rows,
		)
	})
</script>
<template>
	<div class="w-full">
		<div
			:class="props.wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'"
			class="tracking-normal font-normal code-input border bg-white language-javascript text-[1.1em] transition-all"
		>
			<textarea
				ref="inp"
				v-model="theValue"
				class="w-full"
				v-bind="$attrs"
				@input="update"
				@keyup="autofill($event)"
				@scroll="sync_scroll"
				@keydown.tab.prevent="tabber($event)"
				@keydown.enter.prevent="indenter($event)"
			/>
			<pre ref="pre"><code
				class="w-full"
				v-html="highlighted"
			/></pre>
		</div>

		<div
			class="flex justify-center w-full mt-2"
			v-if="resizeable"
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
		caret-color: inherit !important; /* Or choose your favourite color */
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
