<template>
	<div class="question-wrapper overflow-x-auto">
		<div v-if="correctionMode">
			<div v-katex.auto.nomargin.left="questionAsTex" />
		</div>
		<div v-else>
			<div v-katex.auto="questionAsTex" />
		</div>

		<div v-show="!correctionMode">
			<button
				v-if="showKeyboardToggle"
				class="btn bg-white w-full my-2"
				@click="giveAnswer=!giveAnswer"
			>
				Donner la réponse
			</button>
			<div
				v-if="answerFormat"
				v-katex.auto="answerFormat"
				class="text-xs text-center"
			/>
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
					key-class="bg-white"
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
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue"
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
	showKeyboardToggle: {type: Boolean, default: false},
	correctionMode: {type: Boolean, defaut: false}
})

const checker = useCheckers(props.checker ?? "exact")

let checkerResult = ref({
		result: null,
		message: ""
	}),
	multipleAnswer = computed(() => {
		return props.question.split("$").length > 2
	}),
	answer = ref(""),
	tex = ref(""),
	answers = ref([]),
	keyboardUI = ref(null),
	answerFormat = ref(checker.format),
	giveAnswer = ref(props.showKeyboardToggle === false)

let questionAsTex = computed(() => {
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
	if (body.includes("$")) {
		let questionsVars = [...new Set([...body.matchAll(/\$([a-z])/g)].map(x => x[0]))]
		questionsVars.sort()

		// on récupère la liste des réponses.
		userAnswer = userAnswer.split(",")
		const crtAnswerIndex = userAnswer.length - 1
		userAnswer = userAnswer.filter(x => x !== "")

		for (let i = 0; i < questionsVars.length; i++) {
			let key = questionsVars[i],
				value = userAnswer[i],
				placeholder = questionsVars.length === 1 ? "réponse" : key[1]

			if (i === crtAnswerIndex) {
				value = `\\textcolor{cornflowerblue}{ ${(value && value !== "") ? value : "< " + placeholder + " >"} }`
			}
			if (value === undefined) {
				value = `\\textcolor{red}{ <  ${placeholder} > }`
			}

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

let validate = function () {
	checkerResult.value = checker.check(props.answer, answer.value)

	answers.value.push({
		value: `${questionAsTex.value}`,
		result: checkerResult.value.result
	})

	let returnedValue = {
		...checkerResult.value, answer: answer.value, question: questionAsTex.value
	}
	if (checkerResult.value.result) {
		// Flash message.
		giveAnswer.value = false

	} else {
		if (keyboardUI.value) {
			keyboardUI.value.wrongAnswer()
		}
	}

	emits("validate", returnedValue)
}

defineExpose({keyboardUI})

watch(()=>props.correctionMode, (correction, before)=>{
	if(correction){
		if(keyboardUI.value) {
			tex.value = keyboardUI.value.getTex(props.answer)
		}
	}else{
		tex.value = ""
	}
})
onMounted(()=>{
	if(props.correctionMode){
		if(keyboardUI.value) {
			tex.value = keyboardUI.value.getTex(props.answer)
		}
	}
})
</script>
