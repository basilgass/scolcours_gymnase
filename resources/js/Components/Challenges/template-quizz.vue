<template>
	<challenge-wrapper
		ref="root"
		:title="title"
		:points="points"
		:results="results"
		:validate="validate"
	>
		<template #information>
			Donnée
		</template>
		
		<template #question>
			<div v-katex.nomargin="displayQuestion" />
		</template>
		
		<template #answer>
			<div
				v-katex.ascii="displayAnswer"
				class="h-16 text-center"
			/>
		</template>
		
		<template #answerFormat />
		
		<template #inputs>
			<Keyboard
				ref="keyboard"
				v-model="answer"
				keyboard="algebre"
				class="max-w-sm mx-auto"
			/>
		</template>
	</challenge-wrapper>
</template>

<script setup>
import { computed, ref } from 'vue'
import Keyboard from '@/Components/Ui/Keyboard'
import { Fraction } from 'pimath/esm/maths/coefficients'
import { Random } from 'pimath/esm/maths/random'
import ChallengeWrapper from '@/Components/Challenges/ui/challengeWrapper'

const title = 'titre du challenge'

// Active variables
let root = ref(null),		// main reference wrapper
	answer = ref(''),		// the answer given by the user
	points = ref(0),			// current number of points and how to handle them
	results = ref([]),		// list of given results - simple list display.
	keyboard = ref(null),	// keyboard reference.
	question = ref(newQuestion())	// question: {answer: string, tex: string, ...}

let displayAnswer = computed(() => {
		return answer.value
	}),
	displayQuestion = computed(() => {
		return question.value.tex
	})

function newQuestion () {
	let result = '',
		tex = ''
	
	// Create the question
	
	return {
		answer: result,
		tex,
	}
	
}

function reset () {
	// Reset keyboard.
	keyboard.value.resetKeyStrokes()
}

function validate () {
	// Display the list of results.
	const result = {
		tex: question.value.tex,
		ascii: answer.value,
		correct: false
	}
	
	// Validate answer
	if (answer.value === question.value.answer) {
		// Answer is correct
		points.value++
		result.correct = true
		
		// Reset and create new question
		reset()
		question.value = newQuestion()
	} else {
		// Answer is wrong
		points.value = 0
		root.value.shake()
	}
	
	// Add the given answer to the result list.
	results.value.push(result)
	
}
</script>
