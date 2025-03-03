<script setup lang="ts">

import AsciiMathParser from "@/asciimath2tex"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, ref} from "vue"
import {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface,
} from "@/Composables/useKeyboard.js"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
// TODO: Change this event to receive only the input as a string
function onChange(): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	const valueToUpdate = value ? value : inputValue.value
	return {
		input: valueToUpdate,
		tex: isTex.value ? valueToUpdate : new AsciiMathParser().parse(valueToUpdate),
		raw: valueToUpdate
	}
}

defineExpose<KeyboardExposeInterface>({
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */

let inputValue = ref("")

// TODO: isTex from KeyboardInput: is it really useful ?
const isTex = computed(() => {
	return props.keyboard.parameters.includes("tex")
})

</script>

<template>
	<div>
		<form-maker
			v-model="inputValue"
			name="kbrd-input"
			label="réponse"
			@input="onChange"
		/>
		<div
			class="text-center text-xs text-gray-400"
		>
			FORMAT ?
		</div>
	</div>
</template>
