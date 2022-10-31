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
			Transformer l'équation quadratique cartésienne sous la forme du sommet.
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
	layout = [
		"1", "2", "3", "+", "x",
		"4", "5", "6", "-", "^2",
		"7", "8", "9", "*", "",
		"@reset", "@back", "0", "(", ")",
		"", "", "", "", ""
	]
for(let i=1; i<=10; i++){
	layout.push(`x+${i}`)
	keys[`x+${i}`] = {
		type: "math",
		display: `x+${i}`,
		fn: ()=>`x+${i}`
	}
}
for(let i=1; i<=10; i++){
	layout.push(`x-${i}`)
	keys[`x-${i}`] = {
		type: "math",
		display: `x-${i}`,
		fn: ()=>`x-${i}`
	}
}

const keybrd = ref({
	grid: "grid-cols-5",
	layout,
	keys
})

// Default settings.
let {question, answer, points, lives, results, keyboard, validate} = useChallenge(generateQuestion, checkAnswer)
let level = ref(5)

function generateQuestion () {
	let ra = points.value >= level.value ? PiMath.Random.numberSym(6, false) : 1,
		rb = PiMath.Random.numberSym(6, false),
		rc = PiMath.Random.numberSym(10, false)

	let texA = Math.abs(ra)===1?( ra===1?"":"-" ):ra,
		texB = rb>0?`+${rb}`:rb,
		texC = rc>0?`+${rc}`:rc

	return {
		tex: (new PiMath.Polynom("x", ra, 2 * rb * ra, rb * rb * ra + rc)).tex,
		answer: `${texA}(x${texB})^2${texC}`,
		data: [ra, rb, rc]
	}
}

function checkAnswer () {
	return {
		tex: `${question.value.tex}=${answer.value}`,
		text: "",
		correct: question.value.answer === answer.value
	}
}
</script>
