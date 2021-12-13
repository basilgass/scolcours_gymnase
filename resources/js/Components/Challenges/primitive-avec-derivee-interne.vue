<template>
	<article>
		<challenge-title :title="title" />
		
		<div>score actuel: {{ points }}</div>
		<div
				v-katex.nomargin="displayQuestion"
				class="h-16"
			/>
		<div
				v-katex.ascii="displayAnswer"
				class="h-16 text-center"
			/>
		
		<div class="text-center py-5">
			<button
					class="btn btn-success w-64"
					@click="validateAnswer"
				>
				Valider
			</button>
		</div>
		
		<Keyboard
				v-model="answer"
				:keyboard="customKeyboard"
				class="max-w-sm mx-auto"
			/>
	</article>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChallengeTitle from '@/Components/Challenges/ui/challengeTitle'
import Keyboard from '@/Components/Ui/Keyboard'
import { Polynom } from 'pimath/esm/maths/algebra'
import { Fraction } from 'pimath/esm/maths/coefficients'
import { Random } from 'pimath/esm/maths/random'

const title = 'primitive avec dérivée interne'

let customKeyboard = ref({
	grid: 'grid-cols-5',
	layout: [
		'1', '2', '3', '+', '-',
		'4', '5', '6', '/', '',
		'7', '8', '9', 'x', '^',
		'@reset', '@back', '0', '(', ')',
		['equ1',5],
		['equ2', 5]
	],
	keys: {
		'equ1': {type: 'math', display: 'x', fn:()=>'xxxxx'},
		'equ2': {type: 'math', display: 'x', fn:()=>'yyyyy'},
	}
})

let answer = ref(''),
	points = ref(0),
	level = ref(0),
	question = ref(newQuestion())


let displayAnswer = computed(()=>{
	if(question.value.rational) {
		if (answer.value.includes('/')) {
			return answer.value.split('/').map(value => value === '' ? '' : `(${value})`).join('/')
		} else {
			return answer.value
		}
	}else{
		return answer.value
	}
})
let displayQuestion = computed(()=>{
	return question.value.tex
})

function newQuestion(){
	let P = new Polynom().random({
			letters: 'x',
			degree: Random.number(2, 5),
			numberOfMonoms: Random.number(2, 3)
		}).reorder(),
		degree = Random.number(2, 5),
		factor = Random.numberSym(10, false),
		Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
		k, kden, result, tex, rational
	
	if(Random.bool()){
		// Two factors
		
		// Constant
		k = new Fraction(factor, degree+1).reduce()
		
		// Result as ascii math
		result = `${k.display}(${P.tex})^${degree+1}`
		
		// Latex output
		tex = `\\int\\ (${P.tex})^${degree}\\cdot(${Q.tex})`
		
		// Is rational ?
		rational = false
	}else{
		// Rational
		
		// Constant
		k = new Fraction(factor, -degree+1).reduce()
		
		// Get the denominator
		kden = k.denominator===1?'':(k.denominator===-1?'-':k.denominator)
		
		// Result as "partial" ascii math
		if(degree-1===1){
			result = `${k.numerator}/${P.tex}`
		}else{
			result = `${k.numerator}/${kden}(${P.tex})^${degree-1}`
		}
		
		// Latex output
		tex = `\\int\\ \\frac{${Q.tex}}{ (${P.tex})^${degree} }`
		
		// Is rational ?
		rational = true
	}
	
	
	// Mise à jour du clavier.
	customKeyboard.value.keys.equ1.display = P.tex
	customKeyboard.value.keys.equ1.fn = (value)=>value + P.display
	customKeyboard.value.keys.equ2.display = Q.tex
	customKeyboard.value.keys.equ2.fn = (value)=>value + Q.display
	
	return  {
		answer: result,
		tex: tex + ' = ',
		rational
	}
	
	
}
function resetAsnwer(){
	answer.value = ''
}

function validateAnswer(){
	if(answer.value===question.value.answer){
		points.value++
		resetAsnwer()
		question.value = newQuestion()
	}else{
		points.value = 0
	}
	
}
</script>
