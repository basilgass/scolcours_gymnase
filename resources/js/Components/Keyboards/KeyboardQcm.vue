<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useKeyboard } from "@/Composables/useKeyboard"
import { asciiToTex } from "@/Composables/keyboardConfig";
import { log } from "three/examples/jsm/nodes/Nodes.js";

let props = defineProps({
	keyboard: { type: Object, required: true },
	answer: { type: String },
})

let emits = defineEmits(["change", "validate"])

let changeEvent = function () {
	let answers = qcmSelections(),
		answersKeys = answers.map(x => x.key)

	// On parcourt toutes les réponses
	let goodAnswers = props.answer.split(",")
	// props.answer = "1,2|3,5|6|7"
	// answersKeys = [1,3,5]

	// le nombre de réponses données doit être le bon.
	let result = goodAnswers.length === answersKeys.length,
		message = ""

	// Chaque réponse doit se trouver dans une liste et uniquement dans une.
	if (result) {
		for (let key of answersKeys) {
			for (let index in goodAnswers) {
				if (goodAnswers[index].split("|").includes(key)) {
					// remove this item
					goodAnswers.splice(Number(index), 1)
					break
				}
			}
		}
		// There should be no more good answers...
		result = goodAnswers.length === 0

		if (!result) {
			message = `il y a ${goodAnswers.length > 1 ? "des" : "une"}  ${goodAnswers.length} réponse${goodAnswers.length > 1 ? "s" : ""} fausse${goodAnswers.length > 1 ? "s" : ""}.`
		}
	} else {
		let delta = goodAnswers.length - answersKeys.length
		if (delta > 0) {
			message = `il manque ${delta} réponse${delta > 1 ? "s" : ""}`
		} else {
			message = `il y a ${-delta} réponse${delta > 1 ? "s" : ""} en trop.`
		}
	}

	emits("change", {
		value: {
			input: answersKeys.join(","),
			tex: answers.map(x => x.tex).join(", "),
			raw: answers.map(x => x.label).join(", ")
		},
		validation: {
			result,
			message
		}
	})
}

/* ------------------*/
// Options du QCM
let isFullWidth = computed(() => {
	return props.keyboard.parameters.includes("full")
}),
	isFlex = computed(() => {
		return props.keyboard.parameters.includes("flex")
	}),
	isTex = computed(() => {
		return props.keyboard.parameters.includes("tex")
	}),
	multiAnswers = computed(() => {
		return props.answer.split(",").length > 1
	})

/* ---------------- */
// Gestion du QCM
let qcmItems = ref([]),
	qcmSelections = function () {
		// Retourne la ou les valeur(s) sélectionnée(s).
		let values = [
			...qcmItems.value
				.filter((x) => x.selected)
		]

		//.map((x) => x[output ? output : "display"]),
		// TODO: Check sorting order.
		values.sort((a, b) => a.key < b.key ? -1 : 1)
		return values
	},
	qcmButtonClick = (element) => {
		if (!multiAnswers.value) {
			// Si on n'est pas dans une "Multi-réponses", on désactive tout.
			qcmItems.value.forEach((e) => (e.selected = false))
		}

		element.selected = !element.selected
		changeEvent()
	}

/* ---------------*/
// Gestion du QCM avec plusieurs réponses.
// let	multiAnswersId = ref(0),
// 	multiAnswersDelete = function(){
// 		multiAnswersId.value--
// 	},
// 	multiAnswersAdd = function(){
// 		multiAnswersId.value++
// 	}

onMounted(() => {
	// Build the Items.
	// key|TeX|Button
	// key|Tex
	// TeX


	qcmItems.value = props.keyboard.values
		.map((x) => {
			let [key, label, tex] = x.split("|")

			// S'il n'y a pas de label
			if (label === undefined) { label = "" + key }

			// Si on est en mode TeX, la label peut être la valeur a afficher.
			if (tex === undefined && isTex.value) { tex = label }

			// Si le label commence par un #, c'est du TeX en mode ASCII.
			const ascii = label.startsWith("#")
			if (ascii) {
				// remove the #
				label = label.substring(1)
				
				// convert the tex value 
				if(tex===undefined) tex = asciiToTex(label)
			}

			return {
				key,
				label,
				tex: tex === undefined ? "" : tex,
				ascii,
				selected: false
			}
		})
})

let { loadAnswerToKeyboard } = useKeyboard(props)
let reset = function () {
	qcmItems.value.forEach(item => item.selected = false)
}
defineExpose({
	reset,
	loadAnswer: (value) => {
		loadAnswerToKeyboard(value, reset, changeEvent, (value) => {
			let keys = value.split(",")

			qcmItems.value.forEach(item => {
				if (keys.includes(item.key)) {
					item.selected = true
				}
			})
		})
	},
	parameters: "full (pleine largeur)\nflex (utilisation de flex)\ntex (converti en TeX)"
})
</script>

<template>
	<div>
		<div class="flex flex-wrap gap-1 md:gap-3 my-5">
			<button v-for="element of qcmItems" :key="element.key" :class="{
				'btn-success': element.selected,
				'bg-white': !element.selected,
				'w-full': isFullWidth,
				'flex-1': isFlex,
			}" class="btn" @click="qcmButtonClick(element)">
				<span v-if="element.ascii" v-katex.ascii="element.label" />
				<span v-else-if="isTex" v-katex="element.label" />
				<span v-else v-katex.auto="element.label" />
			</button>
		</div>
	</div>
</template>
