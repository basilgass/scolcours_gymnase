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
import {Cipher} from "@/helpers/cipher.ts"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
function onChange(): void {
	setInput().then((x) => emits("change", x))
}

async function setInput(value?: string): Promise<KeyboardInputInterface> {
	let valueToUpdate = value ? value : inputValue.value

	if (isNormalized.value) {
		valueToUpdate = Cipher._normalize(valueToUpdate)
	}

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

const isNormalized = computed(() => {
	return props.keyboard.parameters.includes("norm")
})

const format = computed(() => {
	if (isTex.value) return 'texte au format LaTeX'

	if (isNormalized.value) return 'text en majuscule, sans accent, sans espace (auto)'

	return 'texte'
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
			{{ format }}
		</div>
	</div>
</template>
