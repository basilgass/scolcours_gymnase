<!--
Entrée utilisateur, permettant d'afficher les claviers
Met à jour la donnée en fonction des réponses.
-->
<template>
	<div class="question-keyboard @container">
		<!-- Message affichant les détails des erreurs  -->
		<div
			v-if="message!==''"
			v-katex.auto="message"
			class="bg-red-100 border border-red-300 katex-container px-3 py-1 rounded text-red-600 text-xs"
		/>

		<!-- Le clavier à proprement dit -->
		<component
			:is="keyboardComponent"
			ref="keyboardUI"
			:options="keyboardOptions"
			:answer="keyboardAnswer"
			@change="updateQuestion"
			@validate="validateQuestion"
		/>

		<!-- Affichage des réponses déjà données pendant cette session -->
		<div
			v-if="givenAnswer.length>0"
			class="flex gap-3 flex-wrap font-code text-xs"
		>
			<div
				v-for="(item, index) of givenAnswer"
				:key="index"
			>
				{{ item }}
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from "vue"
import {useKeyboard} from "@/Composables/useKeyboard"

let {getComponent} = useKeyboard()

const emits = defineEmits(["change", "validate"])

let props = defineProps({
		question: {type: Object, required: true}
	}),
	keyboardUI = ref(null),
	keyboardComponent = computed(()=>{
		return getComponent(props.question.keyboard)
	}),
	keyboardAnswer = computed(()=>{
		return props.question.answer
	}),
	keyboardOptions = computed(()=>{
		return props.question.parameters
	})

let tex = ref(""),
	raw = ref(""),
	message = ref(""),
	givenAnswer = ref([])

let updateQuestion = function(value){
		// value = {tex, raw}
		tex.value = value.tex
		raw.value = value.raw
		message.value=""

		updateBody()
	},
	validateQuestion = function(value){
		// value = {tex, raw, message, correct}
		updateQuestion(value)

		// Save the information to database.
		// It's now disabled

		// Update the given answers array.
		if(value.result){
			message.value = ""
		}else{
			message.value = value.message
			givenAnswer.value.push(value.code)
		}

		emits("validate", {
			answer: value.code,
			result: value.correct
		})
	},
	/**
	 * Détermine la liste des variables contenus dans le bloc
	 * @type {ComputedRef<string[]>}
	 */
	answerKeys = computed(()=>{
		let questionsVars = [...new Set([...props.question.block.body.matchAll(/\$([A-Za-z])/g)].map(x => x[0].toLowerCase()))]
		questionsVars.sort()
		return questionsVars
	}),
	/**
	 * émet la nouvelle valeur de "body" à afficher.
	 */
	updateBody = function(){
		let body = props.question.block.body

		if(raw.value!==""){
			if(body.includes("$A")) {
				body = body.replaceAll("$A", raw.value)
			}else{
				body+= `\n\n${raw.value}`
			}
		}else {
			if(body.includes("$")){
				// Build the answer system
				body = makeBodyFromAnswers(tex.value)
			}else{
				// Add the answer at the end, as text code
				body += `\n\n${tex.value}{.font-code .text-center}`
			}
		}

		emits("change", body)
	},
	/**
	 * Création de nouveau "body" en fonction des réponses données.
	 * @param value
	 * @returns {string}
	 */
	makeBodyFromAnswers = function(value) {
		let body = props.question.block.body

		let userAnswer = value.split(",")
		// get list of answers

		// current answer index and values (filtering empty values)
		const crtAnswerIndex = userAnswer.length - 1
		userAnswer = userAnswer.filter(x => x !== "")

		// replace wildcards with values.
		let placeholder
		for (let i = 0; i < answerKeys.value.length; i++) {
			let key = answerKeys.value[i],
				value = userAnswer[i]

			// Raw update.
			// TODO: option to make raw output inline ?
			placeholder = answerKeys.value.length === 1 ? "?" : ` ${key[1]} `
			if (i === crtAnswerIndex) {
				value = `<div class="border border-blue-600 bg-blue-100 py-3 text-center">${(value && value !== "") ? value : "< " + placeholder + " >"}</div>`
			}
			if (value === undefined) {
				value = `<div class="border border-red-600 bg-red-100 text-center"> ${placeholder} </div>`
			}

			if(body.includes(key.toUpperCase())) {
				body = body.replaceAll(key.toUpperCase(), value)
			}

			value = userAnswer[i]
			placeholder = answerKeys.value.length === 1 ? "\\ ?" : key[1]
			if (i === crtAnswerIndex) {
				value = `\\textcolor{cornflowerblue}{ ${(value && value !== "") ? value : "< " + placeholder + " >"} }`
			}
			if (value === undefined) {
				value = `\\textcolor{red}{ <  ${placeholder} > }`
			}
			if(body.includes(key)) {
				body = body.replaceAll(key, value)
			}
		}

		return body
	}

defineExpose({
	getAnswer: (value)=>keyboardUI.value.getAnswer(value),
	makeBodyFromAnswers: (value)=>makeBodyFromAnswers(value)
})

onMounted(()=>{
	updateBody()
})
</script>
