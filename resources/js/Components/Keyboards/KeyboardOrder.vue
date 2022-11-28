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
import {ref} from "vue"
import {PiMath} from "pimath/esm"

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
		let result = 0
		for(let i=1; i<=sortableItems.value.length; i++){
			if(sortableItems.value[i-1].id!==i){
				result++
			}
		}

		emits("change", `${result>0?result+" faute(s)":0}`)
		emits("tex", "")
		emits("raw", "")
		emits("validate", `${result>0?result+" faute(s)":0}`)
	}
defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

/* ------------------*/

let sortableItems = ref(PiMath.Random.shuffle(
	props.options.split("\n").map((element, index)=>{return {
		id: index+1,
		label: element
	}})
))


/*
factoriser la fonction
ensemble de définition \(\text{ED}_f\)
recherche des points caractéristiques
tableau de signes de \(f(x)\)
recherche des asymptotes verticales
recherche des asymptotes horizontales ou obliques
position relative \(\delta(x)\)
tableau de signes de la position relative
tracer le graphe
 */
</script>
