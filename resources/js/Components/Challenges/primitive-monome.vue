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
		q = Random.monom({
			letter: 'x',
			degree: degree,
			fraction: true
		}).coefficient,
		tex = q.isOne()?'':q.tex,
		qa, a
	
	
	// TODO: ajouter les puissances sous forme de fractions
	if(degree === 1 ){
		tex += 'x'
	}else if(degree >1){
		tex += `x^{${degree}}`
	}else if(degree <0){
		tex = `\\frac{${q.numerator}}{${q.denominator===1?'':q.denominator}x`
		if(degree===-1){
			tex += '}'
		}else{
			tex += `^{${-degree}}}`
		}
	}
	
	// TODO: mise en forme de la réponse avec des divisions ?
	if(degree !== -1){
		qa = q.clone().divide(degree+1).reduce()
		if(qa.isOne()){
			a = `x^${degree + 1}`
		}else {
			a = `${qa.display}x^${degree + 1}`
		}
	}else{
		a = `${q.display}ln(|x|)`
	}
	
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
