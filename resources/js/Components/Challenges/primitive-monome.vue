<template>
	<challenge-title :title="title" />

	<div>score actuel:  {{ points }}</div>
	<div v-katex="displayQuestion" />
	<div
			v-katex.ascii="answer"
			class="h-16"
		/>

	<div class="text-center">
		<button
				class="btn btn-success"
				@click="validateAnswer"
			>
			Valider
		</button>
	</div>

	<form-input
			v-model="answer"
			label="réponse"
			name="userAnswer"
		/>
</template>

<script setup>
	import { computed, ref } from "vue"
	import { Random } from "pimath/esm/maths/random/random"
	import FormInput from "@/Components/Form/FormInput"
	import { Monom } from "pimath/esm/maths/algebra/monom"
	import ChallengeTitle from "@/Components/Challenges/ui/challengeTitle"

	// Le titre
	const title = "primitive d'un monôme"

	let answer = ref(""),
		points = ref(0),
		question = ref(newQuestion())

	let displayAnswer = computed(()=>{
		return "display"
	})
	let displayQuestion = computed(()=>{
		return question.value.tex
	})

	function newQuestion(){
		return Random.monom({
			letter: "x",
			degree: Random.number(1,  8),
			fraction: true
		})
	}
	function resetAsnwer(){
		answer.value = []
	}

	function validateAnswer(){
		const M = new Monom(answer.value)

		if(M.derivative("x").isEqual(question.value)){
			points.value++
			resetAsnwer()
			question.value = newQuestion()
		}else{
			points.value = 0
		}

	}
</script>
