<template>
	<div>
		<draggable
			v-model="sortableItems"
			class="grid grid-cols-1 gap-3 my-5"
			v-bind="{
				animation: 200,
			}"
			item-key="id"
		>
			<template #item="{ element }">
				<button
					v-katex.auto="element.label"
					class="btn bg-white"
				/>
			</template>
		</draggable>

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
		</div>
	</div>
</template>

<script setup>

import {wrongAnswerAnimation} from "@/Composables/useHelpers"
import {nextTick, ref} from "vue"
import {PiMath} from "pimath/esm"

let props = defineProps({
	modelValue: {type: String, required: true},
	options: {type: String},
	errorMessage: {type: String, default: ""}
})
let emits = defineEmits(["update:modelValue", "tex", "raw", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
		zeroes.value = ""
		signs.value = ""
	},
	wrongAnswer = function () {
		wrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		const v = value.split("@")

		zeroes.value = v[0]
		signs.value = v[1]

		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
			emits("tex", resolve)
			emits("raw", "")
		})

		return ""
	},
	getRaw = function () {
		nextTick(() => tosUI.value.$el.innerHTML).then(resolve => {
			emits("raw", "")
		})

		return ""
	},
	btnValidate = function () {
		emits("update:modelValue", sortableItems.value.map(element=>element.id).join(""))
		emits("tex", "")
		emits("raw", "")
		emits("validate")
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

/* ------------------*/
let sortableItems = ref(PiMath.Random.shuffle(
	props.options.split("|").map((element, index)=>{return {
		id: index+1,
		label: element
	}})
))

</script>
