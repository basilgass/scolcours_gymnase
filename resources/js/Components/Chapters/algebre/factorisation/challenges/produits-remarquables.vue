<template>
	<challenge-wrapper
		class="max-w-xl mx-auto"
		:results="results"
		:points="points"
		:lives="lives"
		@validate="validate"
	>
		<template #title>
			produit remarquables du 2ème degré
		</template>
		<template #information>
			factoriser le polynôme suivant en utilisant les produits remarquables
		</template>
		<template #question>
			<div v-katex="question.tex" />
		</template>
		<template #answer>
			<div v-katex="answer" />
		</template>
		<template #inputs>
			<Keyboard
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
import Keyboard from "@/Components/Ui/Keyboard"
import {useChallenge} from "@/Composables/useChallenge"
import {ref} from "vue"

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
	let P = PiMath.Random.polynom({
		letters: "x",
		degree: 1,
		unit: true,
		allowNullMonom: false
	})

	if (PiMath.Random.bool(0.40)) {
		let Q = P.clone()
		Q.monoms[1].opposed()
		let R = P.clone().multiply(Q)
		return {tex: R.tex, answer: "", data: R}
	} else {
		let R = P.clone().pow(2)
		return {tex: R.tex, answer: "", data: R}
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
