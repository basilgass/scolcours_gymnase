<script lang="ts" setup>
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import { KeyboardInterface, useKeyboard } from "@/Composables/useKeyboard"
import { computed, PropType, ref } from "vue"

// Each keyboards has props
// props.config: keyboard config, like special letters or other...
// props.answer: expected answer
const props = defineProps({
	answer: { type: String },
	keyboard: { type: Object as PropType<KeyboardInterface>, required: true }
})


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
					if (x.includes("x")) {
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

// Emits change and validate (to trigger a validation manually on the parent)
const emits = defineEmits(["change", "validate"]),
	changeEvent = function () {
		//value = {tex, raw, input}

		// Make the validation.
		// validation = {result: Boolean, message: string}
		let validation = {
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
		emits("change", { value: keyboardInput.value, validation })
	}

// Get the keyboard and make it reactive.
const { loadAnswerToKeyboard } = useKeyboard(props)

// loadAnswerToKeyboard(props.config)
const keyboardInput = ref({ input: "", tex: "", raw: "" }),
	keyboardChange = (event) => {
		keyboardInput.value = event
		changeEvent()
	}

const reset = () => {
	keyboardInput.value = { input: "", tex: "", raw: "" }
}
defineExpose({
	reset,
	loadAnswer: (value) => {
		loadAnswerToKeyboard(value, reset, changeEvent, (value) => {
			keyboardInput.value.input = value
			keyboardInput.value.tex = props.keyboard.config.tex(value)
		})
	}
})
</script>

<template>
	<keyboard-display ref="keyboardUI" :extra-letters="extraLetters" :keyboard="kbrdConfig" back
		class="max-w-xl mx-auto" key-class="bg-white" reset @change="keyboardChange" />
</template>
