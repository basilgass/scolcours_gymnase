<template>
	<challenge-wrapper
		class="max-w-xl mx-auto"
		:results="results"
		:points="points"
		:lives="lives"
		@validate="validate"
	>
		<template #title>
			primitive d'un monôme
		</template>
		<template #information>
			calculer la primitive des monômes suivant
		</template>
		<template #question>
			<div v-katex="question.tex" />
		</template>
		<template #answer>
			<div v-katex="answer" />
		</template>
		<template #answerFormat>
			<div class="text-sm text-gray-400 text-center mt-4">
				Pas de puissance négative, pas de puissance sous forme de fraction.<br>
				Les racines peuvent rester au dénominateur<br>
				Pour écrire plusieurs éléments au dénominateur, il faut l'entourer par des parenthèses
			</div>
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
import Keyboard from "@/Components/Ui/Keyboard"
import {PiMath} from "pimath/esm"
import ChallengeWrapper from "@/Components/Challenges/ui/challengeWrapper"
import {useChallenge} from "@/Composables/useChallenge"

// Default settings.
let {question, answer, points, lives, results, keyboard, validate} = useChallenge(generateQuestion, checkAnswer)


function generateQuestion () {
	let degree = PiMath.Random.bool(Math.min(0.1 + points.value * 0.05, 0.8)) ? PiMath.Random.number(0, 6) : PiMath.Random.numberSym(6, true),		// Degree of the x value
		root = PiMath.Random.bool(points.value * 0.07),	// if there is a root item.
		q = PiMath.Random.fraction({natural: points.value < 5, zero: false}),	// random fraction
		tex, texX, qa, a, degree1, degreeDisplay

	// Créer une racine (éventuellement, elle disparaît)
	if (root && degree !== 0) {
		degree = new PiMath.Fraction(degree, 2)
	} else {
		degree = new PiMath.Fraction(degree, 1)
	}
	degree.reduce()

	// Création de la question

	// Affichage de la question
	// f(x) = q * x^{degree}
	degreeDisplay = Math.abs(degree.numerator) === 1 ? "" : `^{${Math.abs(degree.numerator)}}`
	if (degree.denominator === 1) {
		texX = `x${degreeDisplay}`
	} else {
		texX = `\\sqrt{ x${degreeDisplay} }`
	}

	if(degree.isZero()){
		tex = q.frac
	}else if (degree.isNegative()) {
		if (q.denominator === 1) {
			tex = `\\frac{${q.numerator}}{${texX}}`
		} else {
			tex = `\\frac{${q.numerator}}{${q.denominator}${texX}}`
		}
	} else if (degree.isPositive()){
		if (q.denominator === 1) {
			if (q.numerator === 1) {
				tex = `${texX}`
			} else if (q.numerator === -1) {
				tex = `-${texX}`
			} else {
				tex = `${q.numerator}${texX}`
			}
		} else {
			tex = `\\frac{${q.numerator}${texX}}{${q.denominator}}`
		}
	}

	// Mise en forme de la réponse

	// On ajoute un à la puissance.
	degree1 = degree.clone().add(new PiMath.Fraction().one())


	if (degree.value !== -1) {
		qa = q.clone().divide(degree1).reduce()

		if(degree1.isPositive()){
			degreeDisplay = degree1.numerator === 1 ? "" : `^${degree1.numerator}`
			if ( degree.denominator===1){
				// Pas de racine

				if (qa.isOne()) {
					// si la fraction vaut 1, on n'affiche pas le coefficient
					a = `x${degreeDisplay}`
				} else if(qa.isEqual(-1)){
					// si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
					a = `-x${degreeDisplay}`
				} else {
					// on affiche la fraction.
					a = `${qa.display}x${degreeDisplay}`
				}
			} else{
				// avec racine
				if (qa.isOne()) {
					// si la fraction vaut 1, on n'affiche pas le coefficient
					a = `sqrtx${degreeDisplay}`
				} else if(qa.isEqual(-1)){
					// si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
					a = `-sqrtx${degreeDisplay}`
				} else {
					// on affiche la fraction.
					a = `${qa.display}sqrtx${degreeDisplay}`
				}
			}
		}else{
			degreeDisplay = degree1.numerator === -1 ? "" : `^${-degree1.numerator}`
			// Sous forme de fraction car la puissance est négative.
			if ( degree.denominator===1){
				// Pas de racine

				if (qa.isOne()) {
					// si la fraction vaut 1, on n'affiche pas le coefficient
					a = `1/(x${degreeDisplay})`
				} else if(qa.isEqual(-1)){
					// si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
					a = `-1/(x${degreeDisplay})`
				} else {
					// on affiche la fraction.
					if(qa.denominator===1){
						a = `${qa.numerator}/(x${degreeDisplay})`
					}else {
						a = `${qa.numerator}/(${qa.denominator}x${degreeDisplay})`
					}
				}
			} else{
				// avec racine
				if (qa.isOne()) {
					// si la fraction vaut 1, on n'affiche pas le coefficient
					a = `1/(sqrtx${degreeDisplay})`
				} else if(qa.isEqual(-1)){
					// si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
					a = `-1/(sqrtx${degreeDisplay})`
				} else {
					// on affiche la fraction.
					if(qa.denominator===1){
						a = `${qa.numerator}/(sqrtx${degreeDisplay})`
					}else {
						a = `${qa.numerator}/(${qa.denominator}sqrtx${degreeDisplay})`
					}
				}
			}
		}

	} else {
		// cas pariculier avec LN
		if (q.isOne()) {
			// si la fraction vaut 1, on n'affiche pas le coefficient
			a = "ln(|x|)"
		} else if(q.isEqual(-1)){
			// si la fraction vaut -1, on n'affiche pas le coefficient, que le signe
			a = "-ln(|x|)"
		} else {
			a = `${q.display}ln(|x|)`
		}
	}

	return {
		tex,
		answer: a,
		data: null
	}
}

function checkAnswer () {
	return {
		tex: `\\int \\ ${question.value.tex}\\ \\text{d}x = ${answer.value}`,
		text: "",
		correct: question.value.answer === answer.value
	}
}

</script>
