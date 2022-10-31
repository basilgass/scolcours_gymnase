<template>
	<div class="question-wrapper overflow-x-auto relative">
		<!-- correction mode -->
		<div v-if="correctionMode">
			<markdown-it
				katex-class="katex-left"
				:text="questionAsTex"
			/>
			<div
				v-if="!isKeyboardComponent && raw!==''"
				v-html="raw"
			/>
		</div>
		<!-- Question display -->
		<div v-else>
			<illustration-show
				v-if="block.illustrations?.length>0"
				class="bg-white"
				:illustration="block.illustrations[0]"
			/>
			<markdown-it
				:text="questionAsTex"
			/>
			<div
				v-if="!isKeyboardComponent && raw!==''"
				v-html="raw"
			/>
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
				v-katex.auto="checkerResult.message"
				class="text-red-600"
			/>

			<div>
				<div
					v-if="showKeyboardOutput"
					v-katex.display="tex"
					class="min-h-[100px]"
				/>

				<KeyboardBase
					v-if="isKeyboardComponent"
					v-show="showKeyboard || giveAnswer"
					ref="keyboardUI"
					v-model="answer"
					v-model:tex="tex"
					:keyboard="currentKeyboardName"
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
					v-model:raw="raw"
					:options="keyboardComponentProps"
					@validate="validate"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, onMounted, ref, watch} from "vue"
import {useCheckers} from "@/Composables/useCheckers"
import katex from "katex"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

let emits = defineEmits(["validate"])

let props = defineProps({
	block: {type: Object, required: true},
	answer: {type: String, required: true},
	output: {type: String, default: "question = answer"},
	checker: {type: String, default: "exact"},
	keyboard: {type: String, default: "algebra"},
	showKeyboard: {type: Boolean, default: true},
	showKeyboardOutput: {type: Boolean, default: false},
	showKeyboardToggle: {type: Boolean, default: false},
	correctionMode: {type: Boolean, defaut: false}
})

// const checker = useCheckers(props.checker ?? "exact")

let isKeyboardComponent = computed(() => {
		return !(currentKeyboardName && currentKeyboardName.value[0] === "#")
	}),
	keyboardComponentProps = computed(()=>{
		let kbrd = currentKeyboardName.value.split("@")
		return kbrd.length === 2 ? kbrd[1] : null
	}),
	keyboardComponent = computed(() => {
		let kbrd = currentKeyboardName.value.split("@")
		return defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${kbrd[0].substring(1)}`))
	}),
	currentChecker = computed(()=>{
		if(multipleAnswer.value && props.keyboard.includes("|")) {
			let chkrs = props.checker.split("|"),
				answerNumber = answer.value.split(",").length

			if (chkrs.length >= answerNumber) {
				return useCheckers(chkrs[answerNumber - 1])
			} else {
				return useCheckers(chkrs[chkrs.length - 1])
			}
		}else{
			return useCheckers(props.checker??"exact")
		}
	}),
	currentKeyboardName = computed(()=>{
		if(multipleAnswer.value && props.keyboard.includes("|")){
			let kbrds = props.keyboard.split("|"),
				answerNumber = answer.value.split(",").length

			if(kbrds.length>=answerNumber){
				return kbrds[answerNumber-1]
			}else{
				return kbrds[kbrds.length-1]
			}
		}else{
			return props.keyboard
		}
	})

let checkerResult = ref({
		result: null,
		message: ""
	}),
	multipleAnswer = computed(() => {
		if(props.block.body) {
			return props.block.body.split("$").length > 2
		}else{
			return false
		}
	}),
	answer = ref(""),
	tex = ref(""),
	raw = ref(""),
	answers = ref([]),
	keyboardUI = ref(null),
	componentUI = ref(null),
	answerFormat = computed(()=>{
		return currentChecker.value.format()
	}),
	giveAnswer = ref(props.showKeyboardToggle === false)

let questionAsTex = computed(() => {
	let body = props.block.body,
		userAnswer = tex.value
	if(body===undefined){return}

	// TODO: refactor variable changing.
	// On effectue un premier round en supposant que les valeurs sont des valeurs HTML
	if(!isKeyboardComponent.value){
		if (body.includes("$")) {
			let questionsVars = [...new Set([...body.matchAll(/\$([A-Z])/g)].map(x => x[0]))]
			questionsVars.sort()

			// on récupère la liste des réponses.
			userAnswer = userAnswer.split(",")
			const crtAnswerIndex = userAnswer.length - 1
			userAnswer = userAnswer.filter(x => x !== "")

			for (let i = 0; i < questionsVars.length; i++) {
				let key = questionsVars[i],
					value = userAnswer[i],
					placeholder = questionsVars.length === 1 ? "?" : key[1]

				if (i === crtAnswerIndex) {
					value = `<div class="border border-blue-600 bg-blue-100 py-3 text-center">${(value && value !== "") ? value : "< " + placeholder + " >"}</div>`
				}
				if (value === undefined) {
					value = `<div class="border border-red-600 bg-red-100"> ${placeholder} </div>`
				}

				body = body.replaceAll(key, value)
			}
		}
	}
	
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
	checkerResult.value = currentChecker.value.check(props.answer, answer.value)

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
function getRawFromKeyboard() {
	if (componentUI.value) {
		return componentUI.value.getRaw()
	}
}

watch(() => props.correctionMode, (correction, before) => {
	if (correction) {
		getTexFromKeyboard()
	} else {
		tex.value = ""
	}
})
onMounted(() => {
	if (props.correctionMode) {
		getTexFromKeyboard()
	}
})
</script>
