<template>
	<challenge-title :title="title" />

	<div>score actuel:  {{ points }}</div>
	<div v-katex="poly.tex" />
	<div v-katex="displayAnswer" />
  
	<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
		<button
				class="btn btn-primary"
				@click="currentGivenAnswer='a'; answer = {a: '', b: '', c: ''}"
			>
			recommencer
		</button>

		<button
				class="btn btn-success"
				@click="validateAnswer"
			>
			valider
		</button>
	</div>

	<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
		<div class="space-y-2">
			<div
					v-for="n in 10"
					:key="`terme-${n}`"
					v-katex.inline="`-${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`-${n}`)"
				/>
		</div>
		<div class="space-y-2">
			<div
					v-for="n in 10"
					:key="`terme--${n}`"
					v-katex.inline="`+${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`+${n}`)"
				/>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from "vue"
	import { Polynom } from "pimath/esm/maths/algebra"
	import { Random } from "pimath/esm/maths/random"
	import ChallengeTitle from "@/Components/Challenges/ui/challengeTitle"

	// Valeur nécessaire pour nommer la fonction
	const title = "quadratique - la forme du sommet"

	// Le programme...
	let answer = ref({
			a: "",
			b: "",
			c: ""
		}),
		currentGivenAnswer = ref("a"),
		points = ref(0),
		poly = ref(newQuestion())

	let displayAnswer = computed(()=>{
		return `${(answer.value.a!=="+1" && answer.value.a!=="")?+answer.value.a:""}(x${answer.value.b})^2${answer.value.c}`
	})

	function newQuestion(){
		let ra = points.value>5?Random.numberSym(6, false):1,
			rb = Random.numberSym(6, false),
			rc = Random.numberSym(10, false)

		if(ra===1 && currentGivenAnswer.value==="a"){
			answer.value.a = "+1"
			currentGivenAnswer.value="b"
		}
		return new Polynom("x", ra, 2*rb*ra, rb*rb*ra+rc)
	}

	function updateAnswer(value){
		answer.value[currentGivenAnswer.value] = value

		if(currentGivenAnswer.value===undefined){
			answer.value = {a: "", b: "", c: ""}
			currentGivenAnswer.value="a"
		}else {
			currentGivenAnswer.value = ["a", "b", "c"][["a", "b", "c"].indexOf(currentGivenAnswer.value) + 1]
		}
	}

	function validateAnswer(){

		let ra = +answer.value.a,
			rb = +answer.value.b,
			rc = +answer.value.c
		let P = new Polynom("x", ra, 2*rb*ra, rb*rb*ra+rc)

		if(P.isEqual(poly.value)){
			points.value++
			answer.value = {a: "", b:"", c:""}
			currentGivenAnswer.value = "a"
      
			// Generate new polynom
			poly.value = newQuestion()
		}else{
			points.value = 0
		}

	}
</script>
