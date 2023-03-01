<template>
	<div>
		<KeyboardValidateButton
			ref="validateButton"
			@validate="validateEvent"
		/>

		<form-input
			v-model="inputValue"
			name="kbrd-input"
			label="réponse"
			@input="changeEvent"
			@enter="validateEvent"
		/>
	</div>
</template>

<script setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {nextTick, ref} from "vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import FormInput from "@/Components/Form/FormInput.vue"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value)
	},
	changeEvent = async function (value) {
		await nextTick()
		emits("change", {
			tex: "",
			raw: inputValue.value
		})
	},
	validateEvent = function (value) {
		const correct = inputValue.value === props.answer

		emits("validate", {
			code: inputValue.value,
			tex: "",
			raw: inputValue.value,
			correct,
			message: correct ? "" : "ce n'est pas la bonne réponse :("
		})
	},
	getTex = function (value) {
		return ""
	},
	getRaw = function (value) {
		return value
	},
	getAnswer = function(value){
		return {
			tex: getTex(value),
			raw: getRaw(value)
		}
	}
defineExpose({resetKeyStrokes, wrongAnswer, getAnswer})

/* ------------------*/
let	inputValue = ref("")
</script>
