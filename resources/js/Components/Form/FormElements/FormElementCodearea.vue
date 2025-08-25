<script lang="ts" setup>
import {computed, ref} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerPropsNewType} from "@/Components/Form/FormMakerInterface.ts"
import {useTextEditor} from "@/Composables/useTextEditor.ts"
import Prism from "prismjs"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-json"
import "prismjs/components/prism-latex"
import "prismjs/themes/prism.css"
import {latex_macros} from "@/helpers/Macros/latex_macros.ts"
import {javascript_macros} from "@/helpers/Macros/javascript_macros.ts"
import {json_macros} from "@/helpers/Macros/json_macros.ts"

interface FormElementCodeareaPropsInterface extends FormMakerPropsNewType {
	rows?: number,
	language?: "latex" | "json" | "javascript",
	wrap?: boolean,
	resizeable?: boolean,
	autoSize?: boolean
}

// REFACTOR: reformater le code
/**
 * The value of the code area
 */
const theValue = defineModel<string>()
defineOptions({
	inheritAttrs: false
})

const errors = ref<string[]>([])

const props = withDefaults(
	defineProps<FormElementCodeareaPropsInterface>(),
	{
		rows: 4,
		language: 'latex',
		wrap: true,
		resizeable: false,
		autoSize: false
	}
)

defineExpose<FormElementExpose>({
	focus: () => {
		textareaRef.value?.focus()
		// if (select === true) textareaRef.value?.select()
	},
	validate: () => []
})

const emits = defineEmits<FormElementEmits & {
	currentLine: [e: string],
	mathMode: [e: boolean]
}>()

// number of rows
const currentRows = ref(0)

/**
 * Highlight the code using Prism.js
 */
Prism.manual = true
const pre = ref(null)
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
		} catch {
			return theValue.value
		}
	}
	return ""
})

const {
	currentSelectedText,
	textareaRef, isInMathEnv,
	currentLine
} = useTextEditor('input', {
	language: props.language,
	model: theValue
})

/**
 * Synchronize the scroll of the textarea and the pre
 */
function sync_scroll() {
	/* Scroll result to scroll coords of event - sync with textarea */
	pre.value.scrollTop = textareaRef.value.scrollTop
	pre.value.scrollLeft = textareaRef.value.scrollLeft
}

const codeTriggers = computed(() => {
	if (props.language === 'javascript') {
		return javascript_macros
	}

	if (props.language === 'json') {
		return json_macros
	}

	return latex_macros
})

/**
 * Update the height of the textarea to fit the content
 */
const areaHeight = computed(() => {
	const r = +props.rows > 0 ? +props.rows : (theValue.value ?? "").split("\n").length + 2
	return `${0.5 + Math.max(+currentRows.value, r) * 1.4 + 0.5}rem`
})

</script>
<template>
	<div class="w-full">
		<div
			:class="props.wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'"
			class="tracking-normal font-normal code-input
			bg-content
			border language-javascript text-[1.1em] transition-all"
		>
			<textarea
				ref="input"
				v-model="theValue"
				:autofocus="focus"
				class="w-full"
				v-bind="$attrs"
				@scroll="sync_scroll"
				@focus="emits('focus')"
				@blur="emits('blur')"
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
		<div class="flex flex-wrap gap-1 mt-2">
			<button
				v-for="key in Object.keys(codeTriggers)"
				:key="key"
				class="border border-slate-200 rounded text-xs font-code px-2"
				:class="{
					'bg-blue-100': codeTriggers[key].math,
					'bg-white': !codeTriggers[key].math
				}"
			>
				{{ key }}
			</button>
		</div>
	</div>
</template>

<style scoped lang="postcss">
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
