<template>
	<challenge-wrapper
		class="max-w-xl mx-auto"
		:results="results"
		:points="points"
		:lives="lives"
		@validate="validate"
	>
		<template #title>
			Forme du sommet
		</template>
		<template #information>
			Transformer l'équation cartésienne du cercle sous la forme centre-rayon.
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
				keyboard="algebra"
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

// Default settings.
let {question, answer, points, lives, results, keyboard, validate} = useChallenge(generateQuestion, checkAnswer)

function generateQuestion() {
	let ca = PiMath.Random.numberSym(10, true),
		cb = PiMath.Random.numberSym(10, true),
		r = PiMath.Random.number(1, 10)

	let Px = new PiMath.Polynom(`x${ca <= 0 ? "+" : ""}${-ca}`).pow(2),
		Py = new PiMath.Polynom(`y${cb <= 0 ? "+" : ""}${-cb}`).pow(2)

	let circle = new PiMath.Geometry.Circle(
		new PiMath.Geometry.Point(ca, cb),
		r,
		true
	)

	return {
		tex: circle.developed,
		answer: circle.display,
		data: {ca, cb, r}
	}
}

function checkAnswer() {
	return {
		tex: `${question.value.tex}=${answer.value}`,
		text: "",
		correct: question.value.answer === answer.value
	}
}


</script>
