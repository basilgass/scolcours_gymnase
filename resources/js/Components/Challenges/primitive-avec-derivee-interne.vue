<template>
	<article>
		<challenge-title :title="title" />
		
		<div>score actuel: {{ points }}</div>
		
		<div ref="questionWrapper">
			<div
					v-katex.nomargin="displayQuestion"
					class="h-16"
				/>
			<div
					v-katex.ascii="displayAnswer"
					class="h-16 text-center"
				/>
		</div>
		
		<div class="text-center py-5">
			<button
					class="btn btn-success w-64"
					@click="validateAnswer"
				>
				Valider
			</button>
		</div>
		
		<Keyboard
				ref="keyboard"
				v-model="answer"
				:keyboard="customKeyboard"
				class="max-w-sm mx-auto"
			/>
		
		<h3
				v-show="results.length>0"
				class="max-w-2xl mx-auto text-center cursor-pointer font-semibold mt-10 mb-2"
				@click="showResults=!showResults"
			>
			Afficher les résultats
		</h3>
		<transition name="slide-left">
			<Panel
					v-show="showResults"
					class="result-wrapper text-center max-w-2xl mx-auto"
				>
				<div class="space-y-2">
					<div
							v-for="(item, index) in results"
							:key="`result-${index}`"
						>
						<span
								v-katex.display.inline="item.tex"
								:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
							/>
						<span
								v-katex.ascii.display.inline="item.ascii"
								:class="{'text-green-600': item.correct, 'text-red-600': !item.correct}"
							/>
					</div>
				</div>
			</Panel>
		</transition>
	</article>
</template>

<script setup>
import { computed, ref } from 'vue'
import ChallengeTitle from '@/Components/Challenges/ui/challengeTitle'
import Keyboard from '@/Components/Ui/Keyboard'
import { Fraction } from 'pimath/esm/maths/coefficients'
import { Random } from 'pimath/esm/maths/random'
import Panel from '@/Components/Ui/Panel'
import ChallengeWrapper from '@/Components/Challenges/ui/challengeWrapper'

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

let questionWrapper = ref(null),
	keyboard = ref(null),
	answer = ref(''),
	points = ref(0),
	level = ref(0),
	results = ref([]),
	showResults = ref(false),
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
	let P = Random.polynom({
			letters: 'x',
			degree: Random.number(2, 5),
			numberOfMonoms: Random.number(2, 3),
			fraction: false
		}).reorder(),
		degree = Random.number(2, 5),
		factor = points.value<3?1:Random.numberSym(10, false),
		Q = P.divide(P.gcdNumerator()).clone().derivative().multiply(factor),
		k, kden, result, tex, rational
	
	if(Random.bool()){
		// Two factors
		
		// Constant
		k = new Fraction(factor, degree+1).reduce()
		
		// Result as ascii math
		result = `${k.display}(${P.display})^${degree+1}`
		
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
			result = `${k.numerator}/${P.display}`
		}else{
			result = `${k.numerator}/${kden}(${P.display})^${degree-1}`
		}
		
		// Latex output
		tex = `\\int\\ \\frac{${Q.tex}}{ (${P.tex})^${degree} }`
		
		// Is rational ?
		rational = true
	}
	
	// console.log(result)
	
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
function resetAsnwer () {
	keyboard.value.resetKeyStrokes()
}

function validateAnswer(){
	// console.log(answer.value)
	const result = {
		tex: question.value.tex,
		ascii: answer.value,
		correct: false
	}
	
	if(answer.value===question.value.answer){
		points.value++
		result.correct = true
		resetAsnwer()
		question.value = newQuestion()
	}else{
		points.value = 0
		
		questionWrapper.value.style.setProperty('animation-name', 'v-shake-horizontal')
		questionWrapper.value.style.setProperty('animation-duration', '500ms')
		
		setTimeout(() => {
			questionWrapper.value.style.setProperty('animation-name', '')
		}, 500)
		points.value = 0
	}
	
	results.value.push(result)
	
}
</script>
