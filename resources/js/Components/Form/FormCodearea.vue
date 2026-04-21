<script lang="ts" setup>
import {computed, ref} from "vue"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useTextEditor} from "@/Composables/useTextEditor.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"
// import Prism from "prismjs"
// import "prismjs/components/prism-javascript"
// import "prismjs/components/prism-json"
// import "prismjs/components/prism-latex"
// import "prismjs/themes/prism.css"
import {latex_macros} from "@/helpers/Macros/latex_macros.ts"
import {javascript_macros} from "@/helpers/Macros/javascript_macros.ts"
import {json_macros} from "@/helpers/Macros/json_macros.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	autoSize?: boolean
	language?: "latex" | "json" | "javascript"
	resizeable?: boolean
	rows?: number
	wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	rows: 4,
	language: 'latex',
	wrap: true,
	resizeable: false,
	autoSize: false
})

const theValue = defineModel<string>()
const emits = defineEmits<FormElementEmits & {
	currentLine: [e: string],
	mathMode: [e: boolean]
}>()

const {textareaRef} = useTextEditor('input', {language: props.language, model: theValue})
// const inputRef = useTemplateRef<HTMLTextAreaElement>('input')
const {expose} = useFormMaker(textareaRef)
defineExpose<FormElementExpose>(expose)

const currentRows = ref(0)
const pre = ref(null)

// Prism.manual = true
const highlighted = computed(() => {
	if (!theValue.value) return ""

	return ""
	// try {
	// 	if (props.language.toLowerCase() === "latex") {
	// 		return Prism.highlight(theValue.value, Prism.languages.latex, "latex")
	// 	}
	// 	if (props.language.toLowerCase() === "json") {
	// 		return Prism.highlight(theValue.value, Prism.languages.json, "json")
	// 	}
	// 	return Prism.highlight(theValue.value, Prism.languages.javascript, "javascript")
	// } catch {
	// 	return theValue.value
	// }
})


function sync_scroll() {
	pre.value.scrollTop = textareaRef.value.scrollTop
	pre.value.scrollLeft = textareaRef.value.scrollLeft
}

const codeTriggers = computed(() => {
	if (props.language === 'javascript') return javascript_macros
	if (props.language === 'json') return json_macros
	return latex_macros
})

const areaHeight = computed(() => {
	const r = (!props.autoSize && +props.rows > 0)
		? +props.rows
		: (theValue.value ?? "").split("\n").length + 2
	return `${0.5 + Math.max(+currentRows.value, r) * 1.4 + 0.5}rem`
})
</script>

<template>
	<div
		class="w-full"
		:class="{ 'opacity-50 pointer-events-none select-none': props.disabled }"
	>
		<div
			:class="props.wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'"
			class="tracking-normal font-normal code-input bg-content border language-javascript text-[1.1em] transition-all"
		>
			<textarea
				ref="input"
				v-model="theValue"
				:autofocus="focus"
				:disabled="props.disabled"
				class="w-full"
				v-bind="$attrs"
				@blur="emits('blur')"
				@focus="emits('focus')"
				@scroll="sync_scroll"
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
		<div
			v-katex.auto="message"
			:class="messageClass"
		/>
		<div class="flex flex-wrap gap-1 mt-2">
			<button
				v-for="key in Object.keys(codeTriggers)"
				:key="key"
				:class="{
					'bg-blue-100': codeTriggers[key].math,
					'bg-white': !codeTriggers[key].math
				}"
				class="border border-slate-200 rounded text-xs font-code px-2"
			>
				{{ key }}
			</button>
		</div>
	</div>
</template>

<style lang="postcss" scoped>
.code-input {
	position: relative;
	top: 0;
	left: 0;
	display: block;
	overflow: hidden;
	padding: 0;
	margin: 0;
	width: 100%;
	min-height: v-bind(areaHeight);
	font-family: monospace;
	line-height: inherit;
	tab-size: 2;
	caret-color: darkgrey;
}

.code-input textarea,
.code-input pre {
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
	font-size: inherit !important;
	font-family: inherit !important;
	line-height: inherit !important;
	tab-size: inherit !important;
}

.code-input textarea,
.code-input pre {
	position: absolute;
	top: 0;
	left: 0;
}

.code-input textarea {
	z-index: 1;
}

.code-input pre {
	z-index: 0;
}

.code-input textarea {
	color: transparent;
	background: transparent;
	caret-color: inherit !important;
}

.code-input textarea,
.code-input pre {
	overflow: auto !important;
	white-space: inherit;
	word-spacing: normal;
	word-break: normal;
	word-wrap: normal;
}

.code-input textarea {
	resize: none;
	outline: none !important;
}
</style>
