<template>
	<challenge-wrapper
		:lives="lives"
		:points="points"
		:results="results"
		class="max-w-xl mx-auto"
		@validate="validate"
	>
		<template #title>
			primitive d'un produit de polynôme
		</template>
		<template #information>
			Calculer une primitive du polynôme suivant
		</template>

		<template #question>
			<div v-katex="question.tex" />
		</template>

		<template #answer>
			<div
				v-katex.ascii="displayAnswer===''?'?':displayAnswer"
				class="h-20 text-center"
			/>
		</template>

		<template #answerFormat>
			<div class="grid xs:grid-cols-2 md:grid-cols-4">
				<div v-katex.inline.display="'\\frac{3}{\\textcolor{red}{-}2(x+3)^2}\\implies \\frac{-3}{2(x+3)^2}'" />
				<div v-katex.inline.display="'\\frac{-3}{\\textcolor{red}{1}(x+3)^2}\\implies \\frac{-3}{(x+3)^2}'" />
				<div v-katex.inline.display="'\\frac{-3}{2(x+3)^{\\textcolor{red}{1}}}\\implies \\frac{-3}{2(x+3)}'" />
				<div
					v-katex.inline.display="'\\frac{-3}{\\textcolor{red}{(}x+3\\textcolor{red}{)^1}}\\implies \\frac{-3}{x+3}'"
				/>
			</div>
		</template>

		<template #inputs>
			<KeyboardBase
				ref="keyboard"
				v-model="answer"
				:keyboard="customKeyboard"
				class="max-w-sm mx-auto"
			/>
		</template>
	</challenge-wrapper>
</template>

<script setup>
import {computed, ref} from "vue"
import ChallengeWrapper from "@/Components/Challenges/ui/challengeWrapper"
import {PiMath} from "pimath/esm"
import {useChallenge} from "@/Composables/useChallenge"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

const title = "primitive avec dérivée interne"

let customKeyboard = ref({
	grid: "grid-cols-5",
	layout: [
		"1", "2", "3", "+", "-",
		"4", "5", "6", "/", "",
		"7", "8", "9", "x", "^",
		"@reset", "@back", "0", "(", ")",
		["equ1", 5],
		["equ2", 5]
	],
	keys: {
		"equ1": {type: "math", display: "x", fn: () => "xxxxx"},
		"equ2": {type: "math", display: "x", fn: () => "yyyyy"},
	}
})

let {question, answer, points, lives, results, keyboard, validate} = useChallenge(generateQuestion, checkAnswer)

let displayAnswer = computed(() => {
	if (answer.value.includes("/")) {
		return answer.value.split("/").map(value => value === "" ? "" : `(${value})`).join("/")
	} else {
		return answer.value
	}
})

function generateQuestion () {
	let P = PiMath.Random.polynom({
			letters: "x",
			degree: PiMath.Random.number(2, 5),
			numberOfMonoms: PiMath.Random.number(2, 3),
			fraction: false
		}).reorder(),
		degree = PiMath.Random.number(2, 5),
		factor = points.value < 3 ? 1 : PiMath.Random.numberSym(10, false),
		Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
		k, kden, result, tex, rational

	if (PiMath.Random.bool()) {
		// Two factors

		// Constant
		k = new PiMath.Fraction(factor, degree + 1).reduce()

		// Result as ascii math
		result = `${k.display}(${P.display})^${degree + 1}`

		// Latex output
		tex = `\\int\\ (${P.tex})^${degree}\\cdot(${Q.tex})`

		// Is rational ?
		rational = false
	} else {
		// Rational

		// Constant
		k = new PiMath.Fraction(factor, -degree + 1).reduce()

		// Get the denominator
		kden = k.denominator === 1 ? "" : (k.denominator === -1 ? "-" : k.denominator)

		// Result as "partial" ascii math
		if (degree - 1 === 1) {
			result = `${k.numerator}/${P.display}`
		} else {
			result = `${k.numerator}/${kden}(${P.display})^${degree - 1}`
		}

		// Latex output
		tex = `\\int\\ \\frac{${Q.tex}}{ (${P.tex})^${degree} }`

		// Is rational ?
		rational = true
	}


	// Mise à jour du clavier.
	customKeyboard.value.keys.equ1.display = P.tex
	customKeyboard.value.keys.equ1.fn = (value) => value + P.display
	customKeyboard.value.keys.equ2.display = Q.tex
	customKeyboard.value.keys.equ2.fn = (value) => value + Q.display

	return {
		tex: tex,
		answer: result,
		data: rational
	}

}

function checkAnswer () {
	// console.log(answer.value)
	return {
		tex: `${question.value.tex}=${displayAnswer.value}`,
		ascii: true,
		text: answer.value,
		correct: answer.value === question.value.answer
	}
}

</script>
