<template>
	<div class="question-wrapper overflow-x-scroll">
		<div v-katex.auto="questionAsTex" />

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
				v-show="showKeyboard"
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
	showKeyboardOutput: {type: Boolean, default: false}
})



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
	if(body.includes("$")){
		let vnames = "abcdefghijklmnopqrstuvwxyz"

		// La réponse donnée par l'utilisateur est avec une virgule, dans l'ordre
		userAnswer = userAnswer.split(",")
		const nbOfAnswers = Math.max(userAnswer.length-1, 0)
		userAnswer = userAnswer.filter(x=>x!=="")
		for(let i=0; i<vnames.length; i++){
			const key = "$"+vnames[i]
			if(body.includes(key)){
				if(i<nbOfAnswers) {
					body = body.replaceAll(key, userAnswer[i])
				}else if(i===nbOfAnswers){
					body = body.replaceAll(key, `\\textcolor{blue}{ ${userAnswer[i]??vnames[i]} }`)
				}else{
					body = body.replaceAll(key, `\\textcolor{red}{\\ ${vnames[i]} \\ }`)
				}
			}
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
