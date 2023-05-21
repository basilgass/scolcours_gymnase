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
let changeEvent = async function (event) {
	await nextTick()
	let value = event.target.value
	emits("change", {
		value:		{
			input: value,
			tex: value,
			raw: value
		},
		validation: keyboard.value.checker.check(props.answer, value)
	})
}

/* ------------------*/
let	inputValue = ref(""),
	{makeKeyboard} = useKeyboard() ,
	keyboard = ref(makeKeyboard(props.options, "string"))
</script>
