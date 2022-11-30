<template>
	<div v-show="!correctionMode">
		<button
			v-if="showKeyboardToggle"
			class="btn bg-white w-full my-2"
			@click="showKeyboard=!showKeyboard"
		>
			Donner la réponse
		</button>

		<div class="user-input-messages">
			<div
				v-if="theKeyboardChecker"
				v-katex.auto="theKeyboardChecker.format()"
				class="text-xs text-center"
			/>
			<div
				v-if="answerValidation.message"
				v-katex.auto="answerValidation.message"
				class="text-red-600 text-xs px-3 py-1 border border-red-700 bg-red-100 rounded my-2"
			/>
		</div>
		<div>
			<div
				v-if="showKeyboardOutput"
				v-katex.display="tex"
				class="min-h-[100px]"
			/>

			<KeyboardBase
				v-if="theKeyboard.component===null"
				v-show="showKeyboard"
				ref="keyboardUI"
				:keyboard="theKeyboard.name"
				key-class="bg-white"
				class="max-w-xl mx-auto"
				validate
				reset
				back
				:multiple="answerNumber>1"
				@change="answer = $event;updateQuestion()"
				@tex="tex = $event;updateQuestion()"
				@validate="validate($event)"
				@reset="updateQuestion()"
				@key="answerValidation.message = ''"
			/>
			<component
				:is="theKeyboardComponent"
				v-else
				v-show="showKeyboard"
				ref="componentUI"
				:options="theQuestion.parameters"
				:error-message="answerValidation.message"
				@change="answer = $event;updateQuestion()"
				@tex="tex = $event;updateQuestion()"
				@raw="raw = $event;updateQuestion()"
				@validate="validate($event)"
			/>
		</div>
	</div>
</template>
<script setup>
import {computed, defineAsyncComponent, onMounted, reactive, ref, watch} from "vue"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"
import {useCheckers} from "@/Composables/useCheckers"

let emits = defineEmits(["updated", "validate", "update:question"])
let props = defineProps({
	question: {type: Object, required: true},
	showKeyboardOutput: {type: Boolean, default: false},
	showKeyboardToggle: {type: Boolean, default: false},
	correctionMode: {type: Boolean, default: false}
})

let theQuestion = reactive(props.question),
	answer = ref(""),
	answerNumber = computed(()=>{
		return Math.max(1, answerKeys.value.length)
	}),
	answerKeys = computed(()=>{
		let questionsVars = [...new Set([...theQuestion.block.body.matchAll(/\$([A-Za-z])/g)].map(x => x[0].toLowerCase()))]
		questionsVars.sort()
		return questionsVars
	}),
	answerIndex = ref(0),
	answerValidation = ref({
		result: null,
		message: ""
	})

// Display items
let tex = ref(""),
	raw = ref("")

// Keyboard name, parameters and checker.
let availableKeyboards = computed(()=>{
		let arr = [],
			values = theQuestion.keyboard?theQuestion.keyboard.split("|"):[]

		for(let i=0; i<answerNumber.value; i++){
			let kbrd = values[Math.min(i, values.length-1)]

			if(
				!kbrd.startsWith("#") &&
				availableParameters.value[i]!==""
			){
				const param = availableParameters.value[i].split("@")
				if(param.length===2) {
					kbrd += `@${param[1]}`
				}
			}

			arr.push(kbrd)
		}

		return arr
	}),
	availableParameters = computed(()=>{
		let arr = [],
			values = theQuestion.parameters.split("\n\n")

		for(let i=0; i<answerNumber.value; i++){
			arr.push(values[Math.min(i, values.length-1)])
		}

		return arr
	}),
	availableCheckers = computed(()=>{
		let arr = [],
			values = theQuestion.checker?theQuestion.checker.split("|"):[]

		for(let i=0; i<answerNumber.value; i++){
			let chk = values[Math.min(i, values.length-1)]

			if(!availableKeyboards.value[i].startsWith("#") && availableParameters.value[i]!==""){
				const param = availableParameters.value[i].split("@")
				chk += `@${param[0]}`
			}

			arr.push(chk)
		}

		return arr
	})

watch(answer, (newValue, oldValue)=>{
	if(newValue.split(",").length!==newValue.split(",")
		&& availableKeyboards.value.length>1){
		answerIndex.value = newValue.split(",").length
	}
})

let theKeyboard = computed(()=>{
		let index = Math.min(answerIndex.value, answerNumber.value-1)
		return {
			name: availableKeyboards.value[index]??"exact",
			checker: availableCheckers.value[index]??"string",
			parameters: availableParameters.value[index]??"",
			component: (availableKeyboards.value[index]??"exact").startsWith("#")?availableKeyboards.value[index].substring(1):null
		}
	}),
	isKeyboard = computed(()=>{
		return !theKeyboard.value.name.startsWith("#")
	}),
	theKeyboardComponent = computed(()=>{
		if(theKeyboard.value.component){
			return defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${theKeyboard.value.component}`))
		}else{
			return null
		}
	}),
	theKeyboardChecker = computed(()=>{
		return useCheckers(theKeyboard.value.checker)
	}),
	showKeyboard = ref(!props.showKeyboardToggle)

// Validation
let validate = function(userAnswer){
		// make sure the answer is the correct one
		let result = {
			result: null,
			message: ""
		}

		// answer validation !
		if(answerNumber.value>1){
			result = validateMultipleAnswer(userAnswer)
		}else{
			result = validateOneAnswer({
				user: userAnswer,
				expected: theQuestion.answer
			})
		}

		answerValidation.value.result = result.result
		answerValidation.value.message = result.message

		if(!result.result){
			// Shake - error.
			keyboard.value.wrongAnswer()
		}

		emits("validate", {
			...result,
			answer: userAnswer,
			question: tex.value
		})
	},
	validateOneAnswer = function(theAnswer, index){
		if(index===undefined) {
			return theKeyboardChecker.value.check(theAnswer.expected, theAnswer.user)
		}else{
			let checker = useCheckers(availableCheckers.value[index])
			return checker.check(theAnswer.expected, theAnswer.user)
		}
	},
	validateMultipleAnswer = function(userAnswer){
		let answers = userAnswer.split(",").filter(x=>x!==""),
			expected = theQuestion.answer.split(",").filter(x=>x!==""),
			errors = []

		if(answers.length!==expected.length){
			return {
				result: false,
				message: "le nombre de réponses données ne correspond pas !"
			}
		}
		for(let i = 0; i<answers.length; i++){
			let r = validateOneAnswer({
				user: answers[i],
				expected: expected[i]
			}, i)

			if(r.result===false){
				errors.push(`erreur dans la ${i+1}${i>1?"ème":"ère"} réponse<br/>${r.message}`)
			}
		}

		if(errors.length>0){
			return {
				result: false,
				message: errors.join("<br/><br/>")
			}
		}else{
			return {
				result: true,
				message: ""
			}
		}
	}


// Update teh display while the user enters the input
let updateQuestion = function(){
		updateBody()
	},
	updateBody = function(){
		let body = theQuestion.block.body

		if(raw.value!==""){
			if(body.includes("$A")) {
				body = body.replaceAll("$A", raw.value)
			}else{
				body+= `\n\n${raw.value}`
			}
		}else {
			if(body.includes("$")){
				// Build the answer system
				body = makeBodyFromAnswers()
			}else{
				body += `\n\n${tex.value}{.font-code}`
			}
		}

		emits("updated", body)
	},
	makeBodyFromAnswers = function() {
		let body = theQuestion.block.body

		// get list of answers
		let userAnswer = tex.value.split(",")

		// current answer index and values (filtering empty values)
		const crtAnswerIndex = userAnswer.length - 1
		userAnswer = userAnswer.filter(x => x !== "")

		// replace wildcards with values.
		let placeholder
		for (let i = 0; i < answerKeys.value.length; i++) {
			let key = answerKeys.value[i],
				value = userAnswer[i]

			// Raw update.
			placeholder = answerKeys.value.length === 1 ? "?" : ` ${key[1]} `
			if (i === crtAnswerIndex) {
				value = `<div class="border border-blue-600 bg-blue-100 py-3 text-center">${(value && value !== "") ? value : "< " + placeholder + " >"}</div>`
			}
			if (value === undefined) {
				value = `<div class="border border-red-600 bg-red-100 text-center"> ${placeholder} </div>`
			}

			if(body.includes(key.toUpperCase())) {
				body = body.replaceAll(key.toUpperCase(), value)
			}

			value = userAnswer[i]
			placeholder = answerKeys.value.length === 1 ? "\\ ?" : key[1]
			if (i === crtAnswerIndex) {
				value = `\\textcolor{cornflowerblue}{ ${(value && value !== "") ? value : "< " + placeholder + " >"} }`
			}
			if (value === undefined) {
				value = `\\textcolor{red}{ <  ${placeholder} > }`
			}
			if(body.includes(key)) {
				body = body.replaceAll(key, value)
			}
		}

		return body
	}

let keyboardUI = ref(null),
	componentUI = ref(null),
	getAnswerfromKeyboard = function () {
		if (keyboardUI.value) {
			tex.value = keyboardUI.value.getTex(theQuestion.answer)
			raw.value = ""
		} else if (componentUI.value) {
			tex.value = ""
			raw.value = componentUI.value.getRaw(theQuestion.answer)
		}

		updateBody()
	}

watch(() => props.correctionMode, (correction, before) => {
	if (correction) {
		getAnswerfromKeyboard()
	} else {
		tex.value = ""
		raw.value = ""
		updateQuestion()
	}
})

onMounted(()=>{
	updateQuestion()
	answerIndex.value = 1
})

let keyboard = computed(()=>{
	if (keyboardUI.value) {
		return keyboardUI.value
	} else if (componentUI.value) {
		return componentUI.value
	}
	return null
})
defineExpose({keyboard, updateBody})
</script>
