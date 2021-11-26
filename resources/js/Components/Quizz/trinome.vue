<template>
	<h1 class="text-xl">
		Factoriser
	</h1>

	<div>score actuel:  {{ points }}</div>
	<div v-katex="poly.tex" />
	<div v-katex="factorisation" />

	<div class="text-center">
		<button
				class="btn btn-success"
				@click="validateAnswer"
			>
			Valider
		</button>
	</div>

	<div class="grid grid-cols-2 gap-2 max-w-lg mx-auto mt-5">
		<div class="space-y-2">
			<div
					v-for="n in 10"
					:key="`terme-${n}`"
					v-katex.inline="`x-${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`x-${n}`)"
				/>
		</div>
		<div class="space-y-2">
			<div
					v-for="n in 10"
					:key="`terme--${n}`"
					v-katex.inline="`x+${n}`"
					class="border rounded-2xl bg-white hover:bg-green-100 text-center py-2"
					@click="updateAnswer(`x+${n}`)"
				/>
		</div>
	</div>
</template>

<script setup>
	import { computed, ref } from "vue"
	import { Polynom } from "pimath/esm/maths/algebra"
	import { Random } from "pimath/esm/maths/random"

	const props = defineProps({
		"quizz": String,
	})
	let answer = ref([]),
		points = ref(0),
		poly = ref(newQuestion())
  
	let factorisation = computed(()=>{
		if(answer.value.length===0){return "?"}
		return answer.value.map(x=>`(${x})`).join("")
	})

	function newQuestion(){
		return Random.polynom({
			letters: "x",
			degree: 2,
			factorable: true,
			unit: true,
			allowNullMonom: false
		})
	}
	function updateAnswer(value){
		answer.value.push(value)

		if (answer.value.length>2){
			answer.value.shift()
		}
	}

	function validateAnswer(){
		if(answer.value.length!==2){return false}
    
		let P = new Polynom(answer.value.map(x=>`(${x})`).join(""))
    
		if(P.isEqual(poly.value)){
			points.value++
			answer.value = []
			// Generate new polynom
			poly.value = newQuestion()
		}else{
			points.value = 0
		}

	}
</script>
