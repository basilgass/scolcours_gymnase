<script setup lang="ts">

import AsciiMathParser from "@/asciimath2tex"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { KeyboardEmitsInterface, KeyboardPropsInterface, useKeyboard } from "@/Composables/useKeyboard.js"
import { computed, nextTick, ref } from "vue"

const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onKeyboardChange(): void {
	onChange()
}

const { loadAnswer } = useKeyboard(
	props,
	onKeyboardChange
)

let reset = ()=>{inputValue.value = ""}

defineExpose({ reset, loadAnswer, parameters: "" })

let onChange = async function () {
	await nextTick()
	// let value = event.target.value
	emits("change", {
		value:		{
			input: inputValue.value,
			tex: isTex.value?inputValue.value:new AsciiMathParser().parse(inputValue.value),
			raw: inputValue.value
		},
		validation: checker.value.check(props.answer, inputValue.value)
	})
}

/* ------------------*/
const {getKeyboards} = useKeyboard()

let	inputValue = ref(""),
	isTex = computed(()=>{
		return props.keyboard.parameters.includes("tex")
	}),
	checker = computed(()=>{
		if(props.keyboard.parameters.length===0){
			return {
				check: () => {
					return {message: "il n'y a pas de contrôle...", result: false}
				}
			}
		}

		const kbrds = getKeyboards(props.keyboard.parameters[0])
		if(kbrds===null || kbrds.length===0) {
			return {
				check: () => {
					return {message: "il n'y a pas de contrôle...", result: false}
				},
				format: () => {
					return ""
				}
			}
		}

		return kbrds[0].checker
	})


</script>

<template>
	<div>
		<form-maker
			v-model="inputValue"
			name="kbrd-input"
			label="réponse"
			@input="onChange"
			@enter="$emit('validate')"
		/>
		<div
			v-katex.auto="checker.format"
			class="text-center text-xs text-gray-400"
		/>
	</div>
</template>
