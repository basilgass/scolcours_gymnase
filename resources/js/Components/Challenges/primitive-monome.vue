<template>
	<article>
		<challenge-title
				:title="title"
			/>
		
		<div>score actuel: {{ points }}</div>
		
		<div
				ref="questionWrapper"
				class="text-center space-y-2"
			>
			<span
					v-katex.inline.display="displayQuestion"
					class="mr-2"
				/>
			<span v-katex.ascii.inline.display="answer" />
		</div>
		
		<div class="text-center my-5">
			<button
					class="btn btn-success"
					@click="validateAnswer"
				>
				Valider
			</button>
		</div>
		<Keyboard
				ref="keyboard"
				v-model="answer"
				keyboard="algebra"
				class="max-w-sm mx-auto"
			/>
	</article>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Random } from 'pimath/esm/maths/random/random'
import { Fraction } from 'pimath/esm/maths/coefficients'
import { Monom } from 'pimath/esm/maths/algebra'

import ChallengeTitle from '@/Components/Challenges/ui/challengeTitle'
import Keyboard from '@/Components/Ui/Keyboard'

// Le titre
const title = 'primitive d\'un monôme'

let answer = ref(''),
	points = ref(0),
	question = ref(newQuestion()),
	keyboard = ref(null),
	questionWrapper = ref(null)

let displayAnswer = computed(()=>{
	return 'display'
})
let displayQuestion = computed(()=>{
	return '\\int \\ ' + question.value.tex + '\\ \\text{d}x = '
})

function newQuestion(){
	let degree = Random.numberSym(6, true),
		root = Random.bool(0.95),
		q = Random.monom({
			letter: 'x',
			degree: degree,
			fraction: true
		}).coefficient,
		tex = q.isOne()?'':q.tex,
		qa, a, degree1
	
	// Créer une racine (éventuellement, elle disparaît)
	if(root && degree!==0){
		degree = new Fraction(degree, 2)
	}else{
		degree = new Fraction(degree, 1)
	}
	degree.reduce()
	
	// Création de la question.
	let degreeN = degree.numerator,
		degreeD = degree.denominator
	
	if(q.value===1){
		tex = ''
		if(degreeN>1){
			tex += `x^${degreeN}`
		}
	}else if(q.value===-1){
		tex = '-'
	}else{
		tex = q.display
	}
	
	
	if(degree.denominator===1){
		if(degree.isOne() ){
			tex += 'x'
		}else if(degree.value >1){
			tex += `x^{${degree.display}}`
		}else if(degree.value <0){
			tex = `\\frac{${q.numerator}}{${q.denominator===1?'':q.denominator}x`
			if(degree.value===-1){
				tex += '}'
			}else{
				tex += `^{${degree.clone().opposed().display}}}`
			}
		}
	}else{
		if(degree.isOne() ){
			tex += '\\sqrt{x}'
		}else if(degree.value >0){
			tex += `\\sqrt{x^{${degree.clone().multiply(2).display}}}`
		}else if(degree.value <0){
			tex = `\\frac{${q.numerator}}{${q.denominator===1?'':q.denominator}`
			if(degree.value===-1){
				tex += '\\sqrt{x}}'
			}else{
				tex += `\\sqrt{x^{${degree.clone().multiply(2).opposed().display}}}}`
			}
		}
	}
	
	

	degree1 = degree.clone().add(new Fraction().one())
	
	// TODO: mise en forme de la réponse avec des divisions ?
	if(degree.value !== -1){
		qa = q.clone().divide(degree1).reduce()
		if(qa.isOne()){
			a = `x^${degree1.display}`
		}else {
			a = `${qa.display}x^${degree1.display}`
		}
	}else{
		a = `${q.display}ln(|x|)`
	}
	
	console.log(a)
	
	return {
		tex,
		answer:a
	}
}
function resetAsnwer(){
	keyboard.value.resetKeyStrokes()
}

function validateAnswer(){
	if(question.value.answer===answer.value){
		points.value++
		resetAsnwer()
		question.value = newQuestion()
	}else{
		questionWrapper.value.style.setProperty('animation-name', 'v-shake-horizontal')
		questionWrapper.value.style.setProperty('animation-duration', '500ms')
		
		setTimeout(()=>{
			questionWrapper.value.style.setProperty('animation-name', '')
		}, 500)
		points.value = 0
	}
}
</script>
