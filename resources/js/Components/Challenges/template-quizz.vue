<template>
	<challenge-title :title="title" />

	<div>score actuel:  {{ points }}</div>
	<div v-katex="displayQuestion" />
	<div v-katex="displayAnswer" />

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
	import ChallengeTitle from "@/Components/Challenges/ui/challengeTitle"

	const title = "titre du template"

	let answer = ref([]),
		points = ref(0),
		question = ref(newQuestion())

	let displayAnswer = computed(()=>{
		return "display"
	})
	let displayQuestion = computed(()=>{
		return question.value.tex
	})

	function newQuestion(){
		return  {
			tex: "Hello"
		}
	}
	function resetAsnwer(){
		answer.value = []
	}
	function updateAnswer(value){
		answer.value.push(value)

		if (answer.value.length>2){
			answer.value.shift()
		}
	}

	function validateAnswer(){
		if(answer.value.length!==2){return false}

		if(true){
			points.value++
			resetAsnwer()
			question.value = newQuestion()
		}else{
			points.value = 0
		}

	}
</script>
