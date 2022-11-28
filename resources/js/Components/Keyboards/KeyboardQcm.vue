<template>
	<div>
		<div class="flex flex-wrap gap-1 md:gap-3 my-5">
			<button
				v-for="element of qcmItems"
				:key="element.key"
				class="btn"
				:class="element.selected?'btn-success':'bg-white'"
				@click="btnClick(element)"
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
import {onMounted, ref} from "vue"

let props = defineProps({
	options: {type: String},
	errorMessage: {type: String, default: ""}
})
let emits = defineEmits(["change", "tex", "raw", "validate"])
let validateButton = ref(null),
	resetKeyStrokes = function () {
	},
	wrongAnswer = function () {
		wrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		emits("tex", "")
		return ""
	},
	getRaw = function (value) {
		let result = props.options.split("\n").map(x=>`- ${x}`).join("\n")
		emits("raw", result)
		return result
	},
	btnValidate = function () {
		emits("change", qcmSelections("key"))
		emits("tex", qcmSelections("display"))
		emits("raw", "")
		emits("validate", qcmSelections("key"))
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

/* ------------------*/
let qcmSelections = function(output){
		let values = [...qcmItems.value
			.filter(x=>x.selected)
			.map(x=>x[output?output:"display"])]
		values.sort()

		return values.join(",")
	},
	qcmItems = ref( []),
	btnClick = function(element){
		qcmItems.value.forEach(e=>e.selected = false)
		element.selected =!element.selected

		emits("tex", qcmSelections("display"))
	}

onMounted(()=>{
	qcmItems.value = props.options
		.split("\n")
		.filter(x=>x!=="")
		.map(x=>{
			let keyDisplay = x.split("|"),
				key, display, ascii
			if(keyDisplay.length===1){
				ascii = keyDisplay[0].startsWith("#")
				key = ascii?keyDisplay[0].substring(1):keyDisplay[0]
				display = key
			}else{
				ascii = keyDisplay[1].startsWith("#")
				key = keyDisplay[0]
				display = ascii?keyDisplay[1].substring(1):keyDisplay[1]
			}

			return {key, display, ascii, selected: false}
		})
})
</script>
