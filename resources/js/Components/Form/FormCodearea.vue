<script lang="ts" setup>
import {computed, onMounted, useTemplateRef} from "vue"
import {useMagicKeys, whenever} from "@vueuse/core"
import {formatMarkdownTables} from "@/helpers/markdownTableFormatter.ts"
import {FormElementEmits, FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"
import {useCodeMirrorExtensions} from "@/Composables/useCodeMirrorEditor.ts"
import {pidrawExtensions, pidrawParamsLanguage} from "@/helpers/pidrawLanguage.ts"
import {latex_macros} from "@/helpers/Macros/latex_macros.ts"
import {javascript_macros} from "@/helpers/Macros/javascript_macros.ts"
import {json_macros} from "@/helpers/Macros/json_macros.ts"
import {Codemirror} from "vue-codemirror"
import {markdown} from "@codemirror/lang-markdown"
import {json} from "@codemirror/lang-json"
import {javascript} from "@codemirror/lang-javascript"
import {basicSetup} from "codemirror"
import {latexLanguage} from "codemirror-lang-latex"
import {parseMathMarkdown} from "@/helpers/codemirrorLatexMarkdown.ts"
import {EditorView, keymap} from "@codemirror/view"
import {Prec} from "@codemirror/state"
import type {CompletionGroup} from "@/helpers/codemirror_completion.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	autoSize?: boolean
	completionGroups?: CompletionGroup[]
	language?: "latex" | "json" | "javascript" | "pidraw" | "pidraw-params"
	resizeable?: boolean
	rows?: number
	singleLine?: boolean
	wrap?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	rows: 1,
	language: 'latex',
	wrap: true,
	resizeable: false,
	autoSize: false
})

const cmExtensions = computed(() => useCodeMirrorExtensions(props.language, props.completionGroups))

const singleLineExt = computed(() =>
	props.singleLine
		? [Prec.highest(keymap.of([
			{key: 'Enter', run: () => true},
			{key: 'Shift-Enter', run: () => true},
		]))]
		: []
)

const lineWrapExt = computed(() =>
	props.wrap && !props.singleLine ? [EditorView.lineWrapping] : []
)

const extensions = computed(() => {
	if (props.language === 'json') return [basicSetup, json(), ...singleLineExt.value, ...lineWrapExt.value, ...cmExtensions.value]
	if (props.language === 'javascript') return [basicSetup, javascript(), ...singleLineExt.value, ...lineWrapExt.value, ...cmExtensions.value]
	if (props.language === 'pidraw') return [basicSetup, ...pidrawExtensions, ...singleLineExt.value, ...lineWrapExt.value, ...cmExtensions.value]
	if (props.language === 'pidraw-params') return [basicSetup, pidrawParamsLanguage, ...singleLineExt.value, ...lineWrapExt.value, ...cmExtensions.value]
	return [basicSetup, markdown({extensions: [parseMathMarkdown(latexLanguage.parser)]}), ...singleLineExt.value, ...lineWrapExt.value, ...cmExtensions.value]
})

const theValue = defineModel<string>()

const {ctrl_shift_f} = useMagicKeys()
whenever(ctrl_shift_f, () => {
	if (theValue.value) theValue.value = formatMarkdownTables(theValue.value)
})

const emits = defineEmits<FormElementEmits & {
	currentLine: [e: string],
	mathMode: [e: boolean]
}>()

const cmRef = useTemplateRef<{ view: EditorView }>('cmEditor')
const {expose} = useFormMaker(computed(() => cmRef.value?.view ?? null))
defineExpose<FormElementExpose>(expose)

const codeTriggers = computed(() => {
	if (props.language === 'javascript') return javascript_macros
	if (props.language === 'json') return json_macros
	if (props.language === 'latex') return latex_macros
	return {}
})

onMounted(() => {
	if (!props.rows) return
	if (props.singleLine) return
	
	const current = theValue.value ?? ''
	const numberOfRows = current.split("\n").length
	if (numberOfRows < props.rows) {
		theValue.value = current + '\n'.repeat(props.rows - numberOfRows)
	}
})
</script>

<template>
	<div
		class="w-full"
		:class="{ 'opacity-50 pointer-events-none select-none': props.disabled }"
	>
		<div
			class="tracking-normal font-normal bg-content border language-javascript text-[1.1em] transition-all"
		>
			<codemirror
				ref="cmEditor"
				v-model="theValue"
				lang="markdown"
				:extensions
			/>
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
