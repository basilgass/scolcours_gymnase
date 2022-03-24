<template>
	<challenge-wrapper
		ref="root"
		:title="title"
		:points="points"
		:results="results"
		:validate="validate"
		class="max-w-xl mx-auto"
	>
		<template #information>
			Calculer une primitive de la fonction suivante
		</template>

		<template #question>
			<div v-katex.nomargin="displayQuestion" />
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

			<Keyboard
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
import Keyboard from "@/Components/Ui/Keyboard"
import ChallengeWrapper from "@/Components/Challenges/ui/challengeWrapper"
import {Fraction} from "pimath/esm/maths/coefficients"
import {Random} from "pimath/esm/maths/random"

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


// Active variables
let root = ref(null),		// main reference wrapper
	points = ref(0),			// current number of points and how to handle them
	answer = ref(""),		// the answer given by the user
	results = ref([]),		// list of given results - simple list display.
	keyboard = ref(null),		// keyboard reference.
	question = ref(newQuestion())	// question: {answer: string, tex: string, ...}

let displayAnswer = computed(() => {
	if (question.value.rational) {
		if (answer.value.includes("/")) {
			return answer.value.split("/").map(value => value === "" ? "" : `(${value})`).join("/")
		} else {
			return answer.value
		}
	} else {
		return answer.value
	}
})

let displayQuestion = computed(() => {
	return question.value.tex
})

function newQuestion () {
	let P = Random.polynom({
			letters: "x",
			degree: Random.number(2, 5),
			numberOfMonoms: Random.number(2, 3),
			fraction: false
		}).reorder(),
		degree = Random.number(2, 5),
		factor = points.value < 3 ? 1 : Random.numberSym(10, false),
		Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
		k, kden, result, tex, rational

	if (Random.bool()) {
		// Two factors

		// Constant
		k = new Fraction(factor, degree + 1).reduce()

		// Result as ascii math
		result = `${k.display}(${P.display})^${degree + 1}`

		// Latex output
		tex = `\\int\\ (${P.tex})^${degree}\\cdot(${Q.tex})`

		// Is rational ?
		rational = false
	} else {
		// Rational

		// Constant
		k = new Fraction(factor, -degree + 1).reduce()

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
		answer: result,
		tex: tex + " = ",
		rational
	}

}

function reset () {
	keyboard.value.resetKeyStrokes()
}

function validate () {
	// console.log(answer.value)
	const result = {
		tex: question.value.tex,
		ascii: answer.value,
		correct: false
	}

	if (answer.value === question.value.answer) {
		points.value++
		result.correct = true
		reset()
		question.value = newQuestion()
	} else {
		points.value = 0
		root.value.shake()
	}

	results.value.push(result)

}
</script>
