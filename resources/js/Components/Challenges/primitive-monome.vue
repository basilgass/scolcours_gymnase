<template>
	<challenge-title :title="title" />

	<div>score actuel:  {{ points }}</div>
	
	<div class="text-center space-y-2">
		<span
				v-katex.inline.display="displayQuestion"
				class="mr-2"
			/>
		<span v-katex.ascii.inline.display="answer" />
	</div>

	<div class="text-center my-5">
		<button
				class="btn btn-success"
				@click="validateAnswer"
			>
			Valider
		</button>
	</div>
	<Keyboard
			v-model="answer"
			keyboard="algebra"
			class="max-w-sm mx-auto"
		/>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Random } from 'pimath/esm/maths/random/random'
import { Monom } from 'pimath/esm/maths/algebra/monom'
import ChallengeTitle from '@/Components/Challenges/ui/challengeTitle'
import Keyboard from '@/Components/Keyboards/Keyboard'

// Le titre
const title = 'primitive d\'un monôme'

let answer = ref(''),
	points = ref(0),
	question = ref(newQuestion())

let displayAnswer = computed(()=>{
	return 'display'
})
let displayQuestion = computed(()=>{
	return '\\int \\ ' + question.value.tex + '\\ \\text{d}x = '
})

function newQuestion(){
	return Random.monom({
		letter: 'x',
		degree: Random.number(1,  8),
		fraction: true
	})
}
function resetAsnwer(){
	answer.value = ''
}

function validateAnswer(){
	const M = new Monom(answer.value)

	if(M.derivative('x').isEqual(question.value)){
		points.value++
		resetAsnwer()
		question.value = newQuestion()
	}else{
		points.value = 0
	}

}
</script>
