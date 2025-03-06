<script lang="ts" setup>
/**
 * Affichage du clavier
 */

import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardEmitsInterface, KeyboardExposeInterface,
	type KeyboardInputInterface,
	type KeyboardPropsInterface
} from "@/Composables/useKeyboard.ts"
import {computed} from "vue"

// props.keyboard
const props = defineProps<KeyboardPropsInterface>()

// emits change
const emits = defineEmits<KeyboardEmitsInterface>()

// emit change event
// TODO: Change this event to receive only the input as a string
function onChange(event: KeyboardInputInterface): void {
	setInput(event.input).then((x) => emits("change", x))
}

async function setInput(value: string): Promise<KeyboardInputInterface> {
	return {
		input: value,
		tex: props.keyboard.config.tex(value),
		raw: ""
	}
}

defineExpose<KeyboardExposeInterface>({
	setInput,
	parameters: ""
})

/**
 * Keyboards custom configuration
 */

const extraLetters = computed(() => {
	return props.keyboard.values.length > 0
		? props.keyboard.values[0].split(",")
		: []
})

const kbrdConfig = computed(() => {
	if (props.keyboard.parameters.length > 0) {
		let items = props.keyboard.parameters.filter((x) =>
				x.startsWith("var:")
			),
			varName

		if (items.length === 1) {
			varName = items[0].split(":")[1]
			return {
				...props.keyboard.config,
				layout: props.keyboard.config.layout.map((x) => {
					if (typeof x === "string" && x.includes("x")) {
						const newKey = (x as string).replace("x", varName)
						return {
							key: newKey,
							display: newKey,
							type: "math"
						}
					}
					return x
				})
			}
		}
	}
	return props.keyboard.config
})


</script>

<template>
	<keyboard-display
		ref="keyboardUI"
		:extra-letters="extraLetters"
		:keyboard="kbrdConfig"
		back
		class="max-w-xl mx-auto"
		reset
		@change="onChange"
	/>
</template>
