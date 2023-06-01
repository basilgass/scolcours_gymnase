<template>
	<keyboard-display
		ref="keyboardUI"
		:keyboard="keyboard.name"
		:extra-letters="keyboard.letters"
		back
		class="max-w-xl mx-auto"
		key-class="bg-white"
		reset
		@change="keyboardChange"
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
	changeEvent = function () {
		//value = {tex, raw, input}

		// Make the validation.
		// validation = {result: Boolean, message: string}
		const validation = keyboard.value.checker.check(props.answer, keyboardInput.value.input)

		// emit change event
		emits("change", {value: keyboardInput.value, validation})
	}

// Get the keyboard and make it reactive.
let {makeKeyboard, loadAnswerToKeyboard} = useKeyboard(props)
let keyboard = ref(makeKeyboard(props.options)),
	keyboardInput = ref({input: "", tex: "", raw: ""}),
	keyboardChange = (event) =>{
		keyboardInput.value = event
		changeEvent()
	}

let reset = ()=>{}
defineExpose({
	reset,
	loadAnswer: (value)=>{
		loadAnswerToKeyboard(value, reset, changeEvent, (value)=>{
			keyboardInput.value.input = value
			keyboardInput.value.tex = keyboard.value.keyboard.tex(value)
		})
	}
})
</script>
