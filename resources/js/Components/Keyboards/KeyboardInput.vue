<template>
	<div>
		<form-input
			v-model="inputValue"
			name="kbrd-input"
			label="réponse"
			@input="changeEvent"
			@enter="$emit('validate')"
		/>
		<div
			v-katex.auto="checker.format()"
			class="text-center text-xs text-gray-400"
		/>
	</div>
</template>

<script setup>

import {computed, nextTick, ref} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {useKeyboard} from "@/Composables/useKeyboard.js"
import AsciiMathParser from "@/asciimath2tex.js"

//TODO: KeyboardInput doit accepter des "checkers" différents, issus de KeyboardBasic
let props = defineProps({
	keyboard: {type: Object, required: true},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])
let changeEvent = async function () {
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

let {loadAnswerToKeyboard} = useKeyboard(props)
let reset = ()=>{inputValue.value = ""}
defineExpose({
	reset,
	loadAnswer: (value)=>{
		loadAnswerToKeyboard(value, reset, changeEvent, (value)=>{
			inputValue.value = value
		})
	},
	parameters: ""
})
</script>
