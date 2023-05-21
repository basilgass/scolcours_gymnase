<template>
	<keyboard-display
		ref="keyboardUI"
		:keyboard="keyboard.name"
		:extra-letters="keyboard.letters"
		back
		class="max-w-xl mx-auto"
		key-class="bg-white"
		reset
		@change="changeEvent"
		@validate="$emit('validate')"
	/>
</template>

<script setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {useKeyboard} from "@/Composables/useKeyboard"
import {ref} from "vue"

// Each keyboards has props
// props.options: keyboard options, like special letters or other...
// props.answer: expected answer
let props = defineProps({
	options: { type: String },
	answer: { type: String },
})

// Used to "move" up the currently keyboard chercker format.
// let checkerFormat = inject("checkerFormat")

// Emits change and validate (to trigger a validation manually on the parent)
let emits = defineEmits(["change", "validate"]),
	changeEvent = function (value) {
		//value = {tex, raw, input}

		// Make the validation.
		// validation = {result: Boolean, message: string}
		const validation = keyboard.value.checker.check(props.answer, value.input)

		// emit change event
		emits("change", {value, validation})
	}

// Get the keyboard and make it reactive.
let {makeKeyboard} = useKeyboard()
let keyboard = ref(makeKeyboard(props.options))


	/*
	resetKeyStrokes = function () {
		keyboardUI.value.resetKeyStrokes()
	},

	getTex = function (value) {
		//TODO: remove it ?
		return theKeyboard.value.keyboard.tex(value)
	},
	getRaw = function (value) {
		return ""
	},
	getAnswer = function (value) {
		return {
			tex: getTex(value),
			raw: getRaw(value),
		}
	}
defineExpose({ resetKeyStrokes, wrongAnswer, getAnswer })
*/
</script>
