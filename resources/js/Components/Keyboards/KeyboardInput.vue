<template>
	<div>
		<form-input
			v-model="inputValue"
			name="kbrd-input"
			label="réponse"
			@input="changeEvent"
			@enter="$emit('validate')"
		/>
	</div>
</template>

<script setup>

import {nextTick, ref} from "vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {useKeyboard} from "@/Composables/useKeyboard"

//TODO: KeyboardInput doit accepter des "checkers" différents, issus de KeyboardBasic
let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])
let changeEvent = async function () {
	await nextTick()
	// let value = event.target.value
	emits("change", {
		value:		{
			input: inputValue.value,
			tex: inputValue.value,
			raw: inputValue.value
		},
		validation: keyboard.value.checker.check(props.answer, inputValue.value)
	})
}

/* ------------------*/
let	inputValue = ref(""),
	{makeKeyboard} = useKeyboard() ,
	keyboard = ref(makeKeyboard(props.options, "string"))


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
