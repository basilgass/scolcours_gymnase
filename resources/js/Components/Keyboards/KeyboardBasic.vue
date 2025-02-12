<script lang="ts" setup>

import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {
	KeyboardEmitsInterface,
	KeyboardInputInterface,
	KeyboardPropsInterface,
	useKeyboard
} from "@/Composables/useKeyboard.ts"
import {computed} from "vue"
import type {CheckerResult} from "pichecker"

// General keyboard config - all keyboards shares the same
// props, emits, keyboardInput,
const props = defineProps<KeyboardPropsInterface>()

const emits = defineEmits<KeyboardEmitsInterface>()

function onKeyboardChange(event: string | KeyboardInputInterface): void {
	onChange(event)
}

const {loadAnswer, keyboardInput, reset} = useKeyboard(props, onKeyboardChange)

defineExpose({reset, loadAnswer})

const onChange = function (event: string | KeyboardInputInterface): void {
	//value = {tex, raw, input}
	keyboardInput.value = typeof event === "string" ? {input: event, tex: event, raw: event} : event

	// Make the validation.
	// validation = {result: Boolean, message: string}
	let validation: CheckerResult = {
		result: false,
		message: "",
		index: 0
	}

	props.answer.split("||").forEach((anAnswer, index) => {
		if (!validation.result) {
			// checker overrides
			if (props.keyboard.checkerOverride && Object.hasOwn(props.keyboard.checkerOverride, keyboardInput.value.input)) {
				validation = {
					result: false,
					message: props.keyboard.checkerOverride[keyboardInput.value.input],
					index
				}
			} else {
				validation = {
					...props.keyboard.checker.check(
						anAnswer,
						keyboardInput.value.input
					),
					index
				}
			}
		}
	})

	// emit change event
	emits("change", {value: keyboardInput.value, validation})
}


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
		key-class="bg-white"
		reset
		@change="onChange"
	/>
</template>
