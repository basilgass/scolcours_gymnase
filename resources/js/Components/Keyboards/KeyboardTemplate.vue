<template>
	<div>
		<div class="overflow-x-scroll my-5">
			<!-- Visual output -->
			<div ref="outputHTML" />
		</div>

		<div class="max-w-xl mx-auto flex flex-col gap-3 keyboard">
			<button
				ref="validateButton"
				class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800
				mb-3"
				@click="btnValidate"
			>
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</button>

			<!-- Keyboards inputs -->
		</div>
	</div>
</template>

<script setup>

import {nextTick, ref} from "vue"

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	options: {type: String}
})
let emits = defineEmits(["update:modelValue", "update:tex", "validate"])


let outputHTML = ref(null),
	validateButton = ref(null),
	btnValidate = function () {
		emits("update:modelValue", "")
		emits("update:tex", "")
		emits("validate")
	},
	resetKeyStrokes = function () {
	// Reset keystrokes
	},
	wrongAnswer = function () {
		if (validateButton.value) {
			validateButton.value.style.setProperty("animation-name", "v-shake-horizontal")
			validateButton.value.style.setProperty("animation-duration", "500ms")

			setTimeout(() => {
				if (validateButton.value) { // the button may have already disappeared !
					validateButton.value.style.setProperty("animation-name", "")
				}
			}, 500)
		}
	},
	getHTML = async function(){
		await nextTick()

		return outputHTML.value.$el.innerHTML
	},
	getTex = function (value) {
		const v = value.split("@")

		nextTick(() => outputHTML.value.$el.innerHTML).then(resolve => {
			emits("update:tex", resolve)
		})

		return ""
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex})
</script>
