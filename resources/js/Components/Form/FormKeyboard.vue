<script lang="ts" setup>
import {computed, onMounted, ref, useTemplateRef} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {type CHECKERS, checkersList, PiChecker} from "@/Checkers"
import FormMakerWrapper from "@/Components/Form/FormMakerWrapper.vue"
import {FormElementExpose, FormMakerBaseProps} from "@/Components/Form/FormMakerInterface.ts"
import {useFormMaker} from "@/Composables/useFormMaker.ts"

defineOptions({inheritAttrs: false})

interface Props extends FormMakerBaseProps {
	rows?: number
}

const props = withDefaults(defineProps<Props>(), {rows: 2})
const theValue = defineModel<string>()

const inputRef = useTemplateRef<HTMLTextAreaElement>('input')
const {expose} = useFormMaker(inputRef)
defineExpose<FormElementExpose>(expose)

const availableKeyboards = [
	"nb", "frac", "sol", "scn", "equ", "fn", "log",
	"exp", "tos", "study", "order", "qcm", "input", "type", "matrix"
]

onMounted(() => {
	if (props.focus) inputRef.value?.focus()
})

const showKeyboardHelper = ref(false)
const currentLine = ref("")

const currentLineKeyboardKey = computed(() => currentLine.value.split(",")[0])
const currentLineKeyboardDescription = computed(() => new PiChecker(currentLineKeyboardKey.value).description)
const currentLineKeyboards = computed(() =>
	Object.keys(checkersList())
		.map((x: CHECKERS) => x.toString())
		.filter((x: string) => x.startsWith(currentLineKeyboardKey.value))
)
const keyboardHelper = computed(() => `${currentLineKeyboardDescription.value}\n- @format:custom format`)

const currentRows = computed(() => {
	try {
		return Math.max(props.rows, theValue.value.split("\n").length + 1)
	} catch {
		return props.rows
	}
})

const onKeyup = () => {
	const pos = inputRef.value.selectionStart
	const lines = theValue.value.split("\n")
	const lineIndex = theValue.value.substring(0, pos).split("\n").length - 1
	currentLine.value = lines[lineIndex]
}

const tabber = () => {
	if (currentLineKeyboards.value.length === 1) {
		const pos = inputRef.value.selectionStart
		const lines = theValue.value.split("\n")
		const lineIndex = theValue.value.substring(0, pos).split("\n").length - 1
		if (lines[lineIndex].startsWith(currentLineKeyboards.value[0])) return
		lines[lineIndex] = currentLineKeyboards.value[0]
		theValue.value = lines.join("\n")
	}
}
</script>

<template>
	<form-maker-wrapper v-bind="{...$attrs,...props}">
		<div class="bg-gray-200">
			<textarea
				ref="input"
				v-model="theValue"
				:rows="currentRows"
				:disabled="props.disabled"
				class="w-full px-2 py-1 focus:outline-hidden focus:ring-0 font-code border-b bg-content border-content"
				v-bind="$attrs"
				@blur="showKeyboardHelper = false"
				@focus="showKeyboardHelper = true"
				@keyup="onKeyup"
				@mouseup="onKeyup"
				@keydown.tab.prevent="tabber"
			/>
			<div class="font-code text-xs flex flex-col gap-3">
				<p>laisser une ligne vide entre deux claviers</p>
				<ul class="list list-inside list-disc">
					<li>@if &lt;réponse&gt;?&lt;message&gt;<br></li>
					<li>touche supplémentaire: [valeur] ou [asciiMath]||[label]</li>
				</ul>
				<div class="flex flex-wrap gap-3">
					<div
						v-for="k in availableKeyboards"
						:key="`available-${k}`"
						class="font-code cursor-pointer text-xs hover:font-semibold"
						@click="inputRef.value = k"
					>
						{{ k }}
					</div>
				</div>
			</div>

			<transition name="fade">
				<div
					v-if="showKeyboardHelper"
					class="fixed right-2 bottom-2 w-[60vw] md:w-[40vw] lg:w-[30vw] z-10"
				>
					<markdown-it
						:text="keyboardHelper"
						class="font-code text-[12px]! mt-5 bg-gray-200 border border-gray-300 p-3 shadow-sm rounded-sm"
					/>
				</div>
			</transition>
		</div>
	</form-maker-wrapper>
</template>
