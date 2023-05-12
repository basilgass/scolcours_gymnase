<template>
	<div>
		<keyboard-validate-button
			ref="validateButton"
			@validate="validateEvent"
		/>
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
	</div>
</template>

<script setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {ref} from "vue"
import {PiMath} from "pimath/esm"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"

//TODO : how to show the answer correctly ?
let props = defineProps({
	options: {type: String},
	answer: {type: String}
})
let emits = defineEmits(["change", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
	},
	wrongAnswer = function () {
		useWrongAnswerAnimation(validateButton.value)
	},
	validateEvent = function () {
		let result = 0
		for(let i=1; i<=sortableItems.value.length; i++){
			if(sortableItems.value[i-1].id!==i){
				result++
			}
		}

		emits("validate", {
			code: `${result>0?result+" faute(s)":""}`,
			tex: "",
			raw: "",
			correct: `${result>0?result+" faute(s)":0}`,
			message: `${result>0?result+" faute(s)":""}`
		})
	},
	getTex = function (value) {
		return ""
	},
	getRaw = function (value) {
		// TODO: Keyboard ORDER : make the solution correctly
		return ""
	},
	getAnswer = function(value){
		return {
			tex: getTex(value),
			raw: getRaw(value)
		}
	}
defineExpose({resetKeyStrokes, wrongAnswer, getAnswer})

/* ------------------*/

let sortableItems = ref(PiMath.Random.shuffle(
	props.options.split("\n").map((element, index)=>{return {
		id: index+1,
		label: element
	}})
))

</script>
