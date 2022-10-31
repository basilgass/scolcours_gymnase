<template>
	<challenge-wrapper
		class="max-w-xl mx-auto"
		:results="results"
		:points="points"
		:lives="lives"
		@validate="validate"
	>
		<template #title>
			décomposition du triôme
		</template>
		<template #information>
			factoriser le polynôme suivant
		</template>
		<template #question>
			<div v-katex="question.tex" />
		</template>
		<template #answer>
			<div v-katex="answer" />
		</template>
		<template #inputs>
			<KeyboardBase
				ref="keyboard"
				v-model="answer"
				:keyboard="keybrd"
				class="max-w-xl mx-auto"
			/>
		</template>
	</challenge-wrapper>
</template>

<script setup>
import {PiMath} from "pimath/esm"
import ChallengeWrapper from "@/Components/Challenges/ui/challengeWrapper"
import {useChallenge} from "@/Composables/useChallenge"
import {ref} from "vue"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

let keys = {},
	layout = []
for(let i=1; i<=10; i++){
	layout.push(`(x+${i})`)
	keys[`(x+${i})`] = {
		type: "math",
		display: `x+${i}`,
		fn: ()=>`(x+${i})`
	}
}
for(let i=1; i<=10; i++){
	layout.push(`(x-${i})`)
	keys[`(x-${i})`] = {
		type: "math",
		display: `x-${i}`,
		fn: ()=>`(x-${i})`
	}
}
layout = [...layout, "@reset", "@back", "", ["^2",2]]

const keybrd = ref({
	grid: "grid-cols-5",
	layout,
	keys
})

// Default settings.
let {question, answer, points, lives, results, keyboard, validate} = useChallenge(generateQuestion, checkAnswer)

function generateQuestion(){
	let R = PiMath.Random.polynom({
		letters: "x",
		degree: 2,
		factorable: true,
		unit: true,
		allowNullMonom: false
	})

	return {
		tex: R.tex,
		answer: "",
		data: R
	}
}
function checkAnswer() {
	let P = new PiMath.Polynom(answer.value)

	return {
		tex: `${question.value.tex}=${answer.value}`,
		text: "",
		correct: P.isEqual(question.value.data)
	}
}
</script>
