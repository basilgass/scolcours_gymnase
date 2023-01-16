<template>
	<div>
		<KeyboardValidateButton
			ref="validateButton"
			@validate="validateEvent"
		/>

		<div class="flex flex-wrap gap-1 md:gap-3 my-5">
			<button
				v-for="element of qcmItems"
				:key="element.key"
				:class="element.selected?'btn-success':'bg-white'"
				class="btn"
				@click="changeEvent(element)"
			>
				<span
					v-if="element.ascii"
					v-katex.ascii="element.display"
				/>
				<span
					v-else
					v-katex.auto="element.display"
				/>
			</button>
		</div>
	</div>
</template>

<script setup>

import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {onMounted, ref} from "vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"

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
	changeEvent = function (value) {
		qcmItems.value.forEach(e => e.selected = false)
		value.selected = !value.selected

		emits("change", {
			tex: qcmSelections("display"),
			raw: ""
		})
	},
	validateEvent = function (value) {
		const correct = qcmSelections("key") === props.answer

		emits("validate", {
			code: qcmSelections("key"),
			tex: qcmSelections("display"),
			raw: "",
			correct,
			message: correct ? "" : "ce n'est pas la bonne réponse :("
		})
	},
	getTex = function (value) {
		return ""
	},
	getRaw = function (value) {
		// TODO: Keyboard QCM : generate raw text.
		// return props.options.split("\n").map(x => `- ${x}`).join("\n")
		return value
	},
	getAnswer = function(value){
		return {
			tex: getTex(value),
			raw: getRaw(value)
		}
	}
defineExpose({resetKeyStrokes, wrongAnswer, getAnswer})

/* ------------------*/
let qcmSelections = function (output) {
		let values = [...qcmItems.value
			.filter(x => x.selected)
			.map(x => x[output ? output : "display"])]
		values.sort()

		return values.join(",")
	},
	qcmItems = ref([])

onMounted(() => {
	//TODO : options pour mettre aléatoire.
	qcmItems.value = props.options
		.split("\n")
		.filter(x => x !== "")
		.map(x => {
			let keyDisplay = x.split("|"),
				key, display, ascii

			if (keyDisplay.length === 1) {
				ascii = keyDisplay[0].startsWith("#")
				key = ascii ? keyDisplay[0].substring(1) : keyDisplay[0]
				display = key
			} else {
				ascii = keyDisplay[1].startsWith("#")
				key = keyDisplay[0]
				display = ascii ? keyDisplay[1].substring(1) : keyDisplay[1]
			}

			return {key, display, ascii, selected: false}
		})
})
</script>
