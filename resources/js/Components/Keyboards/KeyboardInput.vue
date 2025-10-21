<script lang="ts" setup>
// parameters: tex
import AsciiMathParser from "@/asciimath2tex"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, ref} from "vue"
import type {
	KeyboardEmitsInterface,
	KeyboardExposeInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface
} from "@/types/keyboardInterfaces.ts"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
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
	reset: () => {
		//no reset function
	},
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */

let inputValue = ref("")

const isTex = computed(() => {
	return props.keyboard.parameters.includes("tex")
})

</script>

<template>
	<div>
		<form-maker
			v-model="inputValue"
			label="réponse"
			name="kbrd-input"
			@input="onChange"
		/>
		<div
			class="text-center text-xs text-gray-400"
		>
			FORMAT ?
		</div>
	</div>
</template>
