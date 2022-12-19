<template>
	<keyboard-validate-button
		ref="validateButton"
		@validate="validateEvent"
	/>
	<keyboard-element
		v-if="theKeyboard"
		ref="keyboardUI"
		:keyboard="theKeyboard.name"
		:multiple="multiple"
		:extra-letters="theKeyboard.letters"
		back
		class="max-w-xl mx-auto"
		key-class="bg-white"
		reset
		@change="changeEvent"
	/>
</template>

<script setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {computed, ref} from "vue"
import KeyboardElement from "@/Components/Keyboards/KeyboardElement.vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import {useCheckers} from "@/Composables/useCheckers"
import {keyboards} from "@/keyboards"

let props = defineProps({
	options: {type: String},
	answer: {type: String}
})

let emits = defineEmits(["change", "validate"])
let validateButton = ref(null),
	keyboardUI = ref(null),
	resetKeyStrokes = function () {
		keyboardUI.value.resetKeyStrokes()
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value.$el)
	},
	changeEvent = function (value) {
		givenAnswer.value = value
		// value = result from the keyboard as ascii or...
		emits("change", {
			tex: theKeyboard.value.keyboard.tex(value),
			raw: "",
		})
	},
	validateEvent = function () {
		const check = theKeyboard.value.checker.check(props.answer, givenAnswer.value)

		if(!check.result) {
			wrongAnswer()
		}
		emits("validate", {
			code: givenAnswer.value,
			tex: theKeyboard.value.keyboard.tex(givenAnswer.value),
			raw: "",
			correct: check.result,
			message: check.message
		})
	},
	getTex = function (value) {
		return theKeyboard.value.keyboard.tex(value)
	},
	getRaw = function (value) {
		return ""
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

// ---------------------------------------
let availableKeyboards = computed(()=>{
		return props.options ? props.options.split("\n\n") : []
	}),
	answerNumber = ref(1),
	multiple = ref(props.answer.split(",").length > 1),
	givenAnswer = ref("")

let theKeyboard = computed(() => {
	if(availableKeyboards.value.length===0){
		return false
	}
	let kbrd = availableKeyboards.value[Math.min(availableKeyboards.value.length - 1, answerNumber.value)]?.split("\n"),
		[name, checker] = kbrd[0].split("@"),
		letters = "", parameters = ""

	if (kbrd.length > 1) {
		if (kbrd[1].startsWith("@")) {
			letters = kbrd[1].substring(1)
		} else {
			parameters = kbrd[1]
		}
	}
	if (kbrd.length > 2 && parameters !== "") {
		parameters = kbrd[2]
	}

	if(!keyboards.hasOwnProperty(name)){
		name = "exact"
	}

	return {
		name,
		keyboard: keyboards[name],
		checker: useCheckers(checker ?? name),
		letters,
		parameters
	}
})
</script>
