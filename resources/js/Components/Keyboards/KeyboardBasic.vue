<template>
	<keyboard-display
		ref="keyboardUI"
		:keyboard="kbrdConfig"
		:extra-letters="extraLetters"
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
import {computed, ref} from "vue"

// Each keyboards has props
// props.options: keyboard options, like special letters or other...
// props.answer: expected answer
let props = defineProps({
	answer: { type: String },
	keyboard: {type: Object, required: true}
})

// Used to "move" up the currently keyboard chercker format.
// let checkerFormat = inject("checkerFormat")
let extraLetters = computed(()=>{
		return props.keyboard.values.length > 0 ? props.keyboard.values[0].split(",") : []
	}),
	kbrdConfig = computed(()=> {
		if (props.keyboard.parameters.length>0){
			let items = props.keyboard.parameters.filter(x=>x.startsWith("var:")),
				varName

			if(items.length===1){
				varName = items[0].split(":")[1]

				return {
					...props.keyboard.config,
					layout: props.keyboard.config.layout.map(x=>{
						if(x.includes("x")) {
							let newKey = x.replace("x", varName)
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


console.log(props.keyboard.config)

// Emits change and validate (to trigger a validation manually on the parent)
let emits = defineEmits(["change", "validate"]),
	changeEvent = function () {
		//value = {tex, raw, input}

		// Make the validation.
		// validation = {result: Boolean, message: string}
		const validation = props.keyboard.checker.check(props.answer, keyboardInput.value.input)

		// emit change event
		emits("change", {value: keyboardInput.value, validation})
	}

// Get the keyboard and make it reactive.
let {loadAnswerToKeyboard} = useKeyboard(props)

// loadAnswerToKeyboard(props.options)
let keyboardInput = ref({input: "", tex: "", raw: ""}),
	keyboardChange = (event) =>{
		keyboardInput.value = event
		changeEvent()
	}

let reset = ()=>{
	keyboardInput.value = {input: "", tex: "", raw: ""}
}
defineExpose({
	reset,
	loadAnswer: (value)=>{
		loadAnswerToKeyboard(value, reset, changeEvent, (value)=>{
			keyboardInput.value.input = value
			keyboardInput.value.tex = props.keyboard.config.tex(value)
		})
	}
})
</script>
