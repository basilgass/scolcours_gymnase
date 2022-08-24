<template>
	<div class="question-wrapper overflow-x-auto">
		<div v-katex.auto="questionAsTex" />

		<button
			v-if="showKeyboardToggle"
			class="btn bg-white w-full my-2"
			@click="giveAnswer=!giveAnswer"
		>
			Donner la réponse
		</button>
		<div
			v-if="checkerResult.result===false"
			class="text-red-600"
			v-text="checkerResult.message"
		/>

		<div>
			<div
				v-if="showKeyboardOutput"
				v-katex.display="tex"
				class="min-h-[100px]"
			/>

			<Keyboard
				v-show="showKeyboard || giveAnswer"
				ref="keyboardUI"
				v-model="answer"
				v-model:tex="tex"
				:keyboard="keyboard"
				class="max-w-xl mx-auto"
				validate
				reset
				back
				:multiple="multipleAnswer"
				@validate="validate"
				@key="checkerResult.message = ''"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, ref} from "vue"
import Keyboard from "@/Components/Ui/Keyboard"
import {useCheckers} from "@/Composables/useCheckers"
import katex from "katex"

let emits = defineEmits(["validate"])

let props = defineProps({
	question: {type: String, required: true},
	answer: {type: String, required: true},
	output: {type: String, default: "question = answer"},
	math: {type: Boolean, default: true},
	checker: {type: String, default: "exact"},
	keyboard: {type: String, default: "algebra"},
	showKeyboard: {type: Boolean, default: true},
	showKeyboardOutput: {type: Boolean, default: false},
	showKeyboardToggle: {type: Boolean, default: false}
})

let giveAnswer = ref(props.showKeyboardToggle===false)



let checkerResult = ref({
		result: null,
		message: ""
	}),
	multipleAnswer = computed(()=>{
		return props.question.split("$").length>2
	}),
	answer = ref(""),
	tex = ref(""),
	answers = ref([]),
	keyboardUI = ref(null)

let questionAsTex = computed(()=>{
	let body = props.question,
		isMath = props.math,
		userAnswer

	// On vérifie si la réponse est "tex-compatible"
	try {
		katex.renderToString(tex.value)
		userAnswer = tex.value
	} catch {
		userAnswer = "\\color{red}{\\text{ ??? }}"
	}


	// On transforme chaque variable `$a` par sa réponse.
	// On récolte la liste des variables présentent dans la question.
	if(body.includes("$")){
		let questionsVars = [...new Set([...body.matchAll(/\$([a-z])/g)].map(x=>x[0]))]
		questionsVars.sort()

		// on récupère la liste des réponses.
		userAnswer = userAnswer.split(",")
		const crtAnswerIndex = userAnswer.length-1
		userAnswer = userAnswer.filter(x=>x!=="")

		for(let i=0; i<questionsVars.length; i++){
			let key = questionsVars[i],
				value = userAnswer[i],
				placeholder = questionsVars.length===1?"réponse":key[1]

			if(i===crtAnswerIndex){
				value = `\\textcolor{cornflowerblue}{ ${(value && value!=="")?value:"< "+ placeholder +" >"} }`
			}
			if(value===undefined){ value = `\\textcolor{red}{ <  ${placeholder} > }`}

			body = body.replaceAll(key, value)
		}

	}

	if (isMath) {
		if (body[body.length - 1] === "=") {
			body += userAnswer
		}
		body = `\\[${body}\\]`
	}

	return body

})

const checker = useCheckers(props.checker??"exact")

let validate = function(){
	checkerResult.value = checker.check(props.answer, answer.value)

	answers.value.push({
		value: `${questionAsTex.value}`,
		result: checkerResult.value.result
	})

	let returnedValue = {
		...checkerResult.value, answer: answer.value, question: questionAsTex.value}
	if(checkerResult.value.result){
		// Flash message.

	}else{
		if(keyboardUI.value) {
			keyboardUI.value.wrongAnswer()
		}
	}

	emits("validate", returnedValue)
}

defineExpose({keyboardUI})
</script>
