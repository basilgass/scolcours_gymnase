<template>
	<div>
		<div class="flex flex-wrap gap-1 md:gap-3 my-5">
			<button
				v-for="element of qcmItems"
				:key="element.key"
				:class="{
					'btn-success': element.selected,
					'bg-white': !element.selected,
					'w-full': isFullWidth,
					'flex-1': isFlex,
				}"
				class="btn"
				@click="changeEvent(element)"
			>
				<span
					v-if="element.ascii"
					v-katex.ascii="element.label"
				/>
				<span
					v-else-if="isTex"
					v-katex="element.label"
				/>
				<span
					v-else
					v-katex.auto="element.label"
				/>
			</button>
		</div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"

let props = defineProps({
	options: { type: String },
	answer: { type: String },
})

let emits = defineEmits(["change", "validate"])

let changeEvent = function (value) {
	if(!multiAnswers.value) {
		// Si on n'est pas dans une "Multi-réponses", on désactive tout.
		qcmItems.value.forEach((e) => (e.selected = false))
	}

	value.selected = !value.selected

	let answers = qcmSelections(),
		answersKeys = answers.map(x=>x.key)

	// On parcoure toutes les réponses
	let goodAnswers = props.answer.split(",")
	// props.answer = "1,2|3,5|6|7"
	// answersKeys = [1,3,5]

	// le nombre de réponses données doit être le bon.
	let result = goodAnswers.length===answersKeys.length,
		message = ""

	// Chaque réponse doit se trouver dans une liste et uniquement dans une.
	if(result) {
		for (let key of answersKeys) {
			for(let index in goodAnswers){
				if(goodAnswers[index].split("|").includes(key)){
					// remove this item
					goodAnswers.splice(index,1)
					break
				}
			}
		}
		// There should be no more goodanswers...
		result = goodAnswers.length===0

		if(!result){
			message = `il y a ${goodAnswers.length>1?"des":"une"}  ${goodAnswers.length} réponse${goodAnswers.length>1?"s":""} fausse${goodAnswers.length>1?"s":""}.`
		}
	}else{
		let delta = goodAnswers.length-answersKeys.length
		if(delta > 0 ) {
			message = `il manque ${delta} réponse${delta>1?"s":""}`
		}else{
			message = `il y a ${-delta} réponse${delta>1?"s":""} en trop.`
		}
	}

	emits("change", {
		value: {
			intput: "",
			tex: answers.map(x=>x.tex).join(", "),
			raw: answers.map(x=>x.label).join(", ")
		},
		validation: {
			result,
			message
		}
	})
}

/* ------------------*/
// Options du QCM
let qcmOptions = computed(() => {
		return props.options
			.split("\n")
			.filter((x) => x.startsWith("@"))
			.map((x) => x.substring(1))
	}),
	isFullWidth = computed(() => {
		return qcmOptions.value.includes("full")
	}),
	isFlex = computed(() => {
		return qcmOptions.value.includes("flex")
	}),
	isTex = computed(()=>{
		return qcmOptions.value.includes("tex")
	}),
	multiAnswers = computed(()=>{
		return props.answer.split(",").length>1
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
		values.sort((a,b)=>a.key<b.key)
		return values
	}

/* ---------------*/
// Gestion du QCM avec plusieurs réponses.
let	multiAnswersId = ref(0),
	multiAnswersDelete = function(){
		multiAnswersId.value--
	},
	multiAnswersAdd = function(){
		multiAnswersId.value++
	}

onMounted(() => {
	// Build the Items.
	// key|TeX|Button
	// key|Tex
	// TeX

	qcmItems.value = props.options
		.split("\n")
		.filter((x) => x !== "") // on enlève les lignes vides
		.filter((x) => !x.startsWith("@")) // on enlève les lignes commençant par '@' (options)
		.map((x) => {
			let [key, label, tex] = x.split("|")

			// S'il n'y a pas de label
			if(label===undefined){label=""+key}

			// Est-ce que le TeX est donné en ascii ?
			let ascii = label.startsWith("#")
			return {
				key,
				label: label.startsWith("#")?label.substring(1):label,
				tex: tex===undefined?"":tex,
				ascii,
				selected: false }
		})
})
</script>
