<template>
	<div class="question-wrapper overflow-x-auto relative">
		<div v-if="correctionMode">
			<markdown-it
				katex-class="katex-left"
				:text="questionAsTex"
			/>
			<div
				v-if="!isKeyboardComponent"
				v-html="tex"
			/>
		</div>
		<div v-else>
			<markdown-it :text="questionAsTex" />
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
					v-if="isKeyboardComponent"
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
				<component
					:is="keyboardComponent"
					v-else
					v-show="showKeyboard || giveAnswer"
					ref="componentUI"
					v-model="answer"
					v-model:tex="tex"
					:options="keyboardComponentProps"
					@validate="validate"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue"
import Keyboard from "@/Components/Ui/Keyboard"
import {useCheckers} from "@/Composables/useCheckers"
import katex from "katex"
import MarkdownIt from "@/Components/Ui/MarkdownIt"

let emits = defineEmits(["validate"])

let props = defineProps({
	question: {type: String, required: true},
	answer: {type: String, required: true},
	output: {type: String, default: "question = answer"},
	checker: {type: String, default: "exact"},
	keyboard: {type: String, default: "algebra"},
	showKeyboard: {type: Boolean, default: true},
	showKeyboardOutput: {type: Boolean, default: false},
	showKeyboardToggle: {type: Boolean, default: false},
	correctionMode: {type: Boolean, defaut: false}
})

const checker = useCheckers(props.checker ?? "exact")
let isKeyboardComponent = computed(() => {
		return !(props.keyboard && props.keyboard[0] === "#")
	}),
	keyboardComponentProps = computed(()=>{
		let kbrd = props.keyboard.split("@")
		return kbrd.length === 2 ? kbrd[1] : null
	}),
	keyboardComponent = computed(() => {
		let kbrd = props.keyboard.split("@")
		return defineAsyncComponent(() => import(`@/Components/Ui/Keyboards/Keyboard${kbrd[0].substring(1)}`))
	})

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
	componentUI = ref(null),
	answerFormat = ref(checker.format()),
	giveAnswer = ref(props.showKeyboardToggle === false)

let questionAsTex = computed(() => {
	let body = props.question,
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
				placeholder = questionsVars.length === 1 ? "\\ ?" : key[1]

			if (i === crtAnswerIndex) {
				value = `\\textcolor{cornflowerblue}{ ${(value && value !== "") ? value : "< " + placeholder + " >"} }`
			}
			if (value === undefined) {
				value = `\\textcolor{red}{ <  ${placeholder} > }`
			}

			body = body.replaceAll(key, value)
		}

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
		}else if(componentUI.value){
			componentUI.value.wrongAnswer()
		}
	}

	emits("validate", returnedValue)
}

defineExpose({
	keyboard: isKeyboardComponent.value ? keyboardUI : componentUI
})


// Correction mode
// TODO: correction mode for "specific components"
function getTexFromKeyboard() {
	if (keyboardUI.value) {
		return keyboardUI.value.getTex(props.answer)
	} else if (componentUI.value) {
		return componentUI.value.getTex(props.answer)
	}
}

watch(() => props.correctionMode, (correction, before) => {
	if (correction) {
		tex.value = getTexFromKeyboard()
	} else {
		tex.value = ""
	}
})
onMounted(() => {
	if (props.correctionMode) {
		tex.value = getTexFromKeyboard()
	}
})
</script>
