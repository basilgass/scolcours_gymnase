<!--
Affichage d'une question
Envoi de la validation d'une réponse
keyboard -> QuestionUserInput -> QuestionShow
-->
<template>
	<article
		:id="`question-${theQuestion.id}`"
		:class="{
			'rounded border h-full': !props.isMinimal,
			'bg-gray-50 border-gray-200': !theQuestion.user.correct && !props.isMinimal,
			'bg-green-50 border-green-600/60': theQuestion.user.correct && !props.isMinimal,
		}"
	>
		<header class="flex relative">
			<!-- QUESTION NUMBER -->
			<div
				v-if="theQuestion.order && !props.isMinimal"
				class="absolute -left-2 -top-2 rounded-full bg-white border w-8 h-8 text-xs flex justify-center items-center draggable-handle"
				:class="{'draggable-handle cursor-move':$page.props.auth.can.admin}"
			>
				{{ theQuestion.order }}
			</div>

			<!-- QUESTION TITLE -->
			<div
				v-if="props.showTitle"
				v-katex.auto="theQuestion.block.title"
				class="px-5 py-3 font-semibold text-lg"
			/>

			<!-- ADMIN HEADER -->
			<div
				v-if="!isDynamic"
				v-show="editMode.enabled.value"
				v-admin
				class="flex justify-end w-full px-3 gap-3 mt-2"
			>
				<button
					class="text-xs"
					@click="showEditForm=true"
				>
					{{ theQuestion.id }} <i class="bi bi-pencil ml-2" />
				</button>
				<button
					class="text-xs px-2"
					@click="duplicateQuestion"
				>
					<i class="bi bi-clipboard-plus" />
				</button>

				<button
					v-if="!theQuestion.block.illustration"
					class="text-xs px-2"
					@click="addIllustration"
				>
					<i class="bi bi-image" />
				</button>
			</div>
		</header>

		<main class="px-5 overflow-x-auto">
			<!-- the body of question -->
			<!-- Illustration -->
			<illustration-show
				v-if="theQuestion.block.illustration"
				:illustration="theQuestion.block.illustration"
				class="bg-white"
			/>

			<!-- dispalyed text -->
			<markdown-it
				:text="theQuestionBody"
			/>
		</main>

		<!-- user input -->
		<div
			v-if="!showInput"
			class="text-xs px-5 text-right my-3"
		>
			<button
				v-if="!showUserInput"
				class="w-full py-3 hover:border-t hover:border-b"
				:class="`active-scolcours-${$page.props.theme?.slug}`"
				@click="showUserInput=!showUserInput"
			>
				<i class="bi bi-calculator mr-2" />donner la réponse
			</button>
			<button
				v-else
				class="text-red-600"
				@click="showUserInput=!showUserInput"
			>
				fermer <i class="bi bi-x-lg ml-2" />
			</button>
		</div>
		<div
			v-show="showUserInput"
			class="question-user-input px-5"
		>
			<keyboard-validate-button
				ref="validateButton"
				@validate="validateQuestion"
			/>
			<div v-if="userAnswersErrors.length>0">
				<div
					v-for="(msg, index) in userAnswersErrors"
					:key="`error-${index}`"
					v-katex.auto="msg"
					class="text-red-600 text-xs"
				/>
			</div>

			<!-- Answer selector -->
			<div
				class="question-answer-selector flex justify-between items-center my-5"
			>
				<button
					:class="answerId===0?'invisible':`active-scolcours-${$page.props.theme?.slug}`"
					class="px-3 text-xl font-semibold border rounded-full"
					@click="answerId--"
				>
					<i class="bi-chevron-left" />
				</button>
				<div
					v-if="answerFormat"
					v-katex.auto="answerFormat"
					class="text-center text-xs text-gray-400"
				/>
				<button
					:class="answerId===answersNumber-1?'invisible':`active-scolcours-${$page.props.theme?.slug}`"
					class="px-3 text-xl font-semibold border rounded-full"
					@click="answerId++"
				>
					<i class="bi-chevron-right" />
				</button>
			</div>

			<component
				:is="theAnswers[answerId].keyboard.component"
				ref="keyboardUI"
				:options="theAnswers[answerId].keyboard.parameters"
				:answer="theAnswers[answerId].answer"
				@change="updateQuestion"
				@validate="validateQuestion"
			/>
		</div>

		<!-- already answered or admin answer -->
		<div
			v-if="theQuestion.user.correct || $page.props.auth.can.admin"
			class="question-footer mt-5 border-t border-gray-200 px-5 py-2"
		>
			<div>
				<button
					v-if="!showAnswer"
					class="text-xs text-gray-400 w-full"
					@click="loadAnswer"
				>
					<i
						class="bi bi-eye mr-2"
					/>voir la réponse
				</button>
				<div
					v-else
					class="cursor-pointer overflow-x-auto scrollbar-scolcours"
					@click="showAnswer=false"
				>
					<div
						class="text-xs text-center ml-3 font-code font-xs"
						v-text="theQuestion.answer"
					/>
				</div>
			</div>
		</div>

		<!-- Edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:question="props.question"
				@change="updateQuestion"
				@validate="validateQuestion"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</article>
</template>

<script setup>
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {computed, defineAsyncComponent, inject, provide, reactive, ref} from "vue"
import KeyboardValidateButton from "@/Components/Keyboards/KeyboardValidateButton.vue"
import {usePage} from "@inertiajs/inertia-vue3"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers"
import {getKeyboard} from "@/keyboards" // Props

// Props
let props = defineProps({
	question: {type: Object, required: true},
	showTitle: {type: Boolean, default: false},
	showInput: {type: Boolean, default: false},
	isDynamic: {type: Boolean, default: false},
	isMinimal: {type: Boolean, default: false},
})

// flash message
const flash = inject("flash")

// Emits
const emits = defineEmits(["validate", "destroy", "duplicate"])

// Reactivity
let theQuestion = reactive(props.question), // la question principale, vraiment en "reactive" ?
	theQuestionBody = computed(()=>{
		// On s'assure que le tableau des réponses est complet.
		checkUserAnswers()

		// On récupère le body original, avec les placeholder.
		let body =  theQuestion.block.body,
			alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

		// $a, $b, ... sont des valeurs dans des environnements TeX
		// $A, $B, ... sont des valeurs hors des environnements Tex
		for(let i=0; i<answersNumber.value; i++){
			let key = theAnswers.value[i].key,
				rawColor = i===answerId.value ? "border-blue-600 bg-blue-100": "border-red-600 bg-red-100",
				texColor = i===answerId.value ? "cornflowerblue": "red"

			// S'il manque une valeur, on l'ajoute automatiquement à la fin.
			if(key===undefined) {
				key = `$${alphabet[i]}`
				body += "\n\n" + key
			}
			// On met une couleur pour chaque variable.
			// TODO: rajouter des couleurs en fonctions de la bonne réponse ou non ?
			// On supprime les clés sans mise en forme.
			body = body.replaceAll(
				"\n@" + key.toUpperCase(),
				"\n@" + key.toUpperCase() + "\n")
			body = body.replaceAll(
				"\n" + key.toUpperCase(),
				"\n" + key.toUpperCase() + "\n" + `{.border .px-3 .py-1 .${rawColor}}`)
			body = body.replaceAll(
				` ${key.toUpperCase()}`,
				` [${key.toUpperCase()}]{.inline-block .mx-1 .px-3 .py-1 .border .${rawColor} }`)
			body = body.replaceAll(
				key.toLowerCase(),
				`\\textcolor{${texColor}}{ ${key.toLowerCase()} }`)

			// on supprime les valeurs de type @$ qui sont sans mise en forme.
			body = body.replaceAll("@$", "$")

			// On peut avoir tex, raw, input
			if(userAnswers.value[i].value===undefined){
				body = body.replaceAll(key.toUpperCase(), "< ?? >")
				body = body.replaceAll(key.toLowerCase(), "<\\ ? >")
			}else {

				// Raw output
				if (userAnswers.value[i].value.raw === undefined || userAnswers.value[i].value.raw === "") {
					body = body.replaceAll(key.toUpperCase(), "< ?? >")
				} else {
					body = body.replaceAll(key.toUpperCase(), userAnswers.value[i].value.raw)
				}

				// TeX output
				if (userAnswers.value[i].value.tex === undefined || userAnswers.value[i].value.tex === "") {
					body = body.replaceAll(key.toLowerCase(), "<\\ ? >")
				} else {
					body = body.replaceAll(key.toLowerCase(), userAnswers.value[i].value.tex)
				}
			}
		}
		return body
	})


// Gestion des réponses
let answerId = ref(0), // numéro de la question en cours d'édition
	answerFormat = ref(""), // format de la réponse
	answersNumber = computed(()=>theQuestion.answer.split("\n").filter(x=>x!=="").length), // nombre de réponses maximales
	answersKeys = computed(()=>{
		let questionsVars = [...new Set([...props.question.block.body.matchAll(/\$([A-Za-z])/g)].map(x => x[0].toLowerCase()))]
		questionsVars.sort()
		return questionsVars
	}), // liste des littres, dans l'ordre.
	theAnswers = computed(()=>{
		let arr = [],
			answers = theQuestion.answer.split("\n"),
			names = theQuestion.keyboard?theQuestion.keyboard.split("\n"):[""],
			params = theQuestion.parameters.split("\n\n")

		for(let i=0; i<answersNumber.value; i++){
			const kbrd = getKeyboard(names[Math.min(names.length-1, i)])
			arr.push({
				key: answersKeys.value[i],	// may be undefined !
				keyboard: {
					name: kbrd,
					parameters: params[Math.min(params.length-1, i)],
					component: defineAsyncComponent(() => import(`@/Components/Keyboards/Keyboard${kbrd===""?"Basic":kbrd}`)),
				},
				answer: answers[i]
			})
		}

		return arr
	}), // la liste des réponses / claviers / etc...
	userAnswers = ref([]),
	userAnswersErrors = ref([]),
	loadAnswer = function (){
		showAnswer.value = true
	},
	showUserInput = ref(props.showInput)

// donne des fonctions aux claviers
provide("questionHandler", {
	format: (value)=>{answerFormat.value = value},
})


let showAnswer = ref(false),
	updateQuestion = function(event){
		// {
		// 		value: {input, tex, raw},
		// 		validation: {result, message}
		// }
		userAnswers.value[answerId.value] = event
	},
	checkUserAnswers = function(){
		// On contrôle que la table des réponses est correctement initialisée
		if(userAnswers.value.length<answersNumber.value){
			for(let i=userAnswers.value.length; i<answersNumber.value;i++){
				userAnswers.value.push({
					value: {input: "", tex: "", raw: ""},
					validation: {result: false, message: "réponse non donnée."}
				})
			}
		}
	},
	validateButton = ref(null),
	validateQuestion = function(){
		// validation des réponses.
		// On vérifie que toutes les réponses ont été données.
		let result = true,
			stack = []

		for(let i =0; i<userAnswers.value.length; i++){
			result = result && userAnswers.value[i].validation.result

			if(!result) {
				if (userAnswers.value.length > 1) {
					stack.push(`${i + 1}: ${userAnswers.value[i].validation.message}`)
				} else {
					stack.push(userAnswers.value[i].validation.message)
				}
			}
		}

		userAnswersErrors.value = stack

		storeValidation({
			result,
			question: theQuestionBody.value,
			answer: userAnswers.value.map(a=>a.value.input).join(",")
		})

	},
	storeValidation = function(event){
		// event: {question: string, answer: string, result: boolean}
		if(!event.result){useWrongAnswerAnimation(validateButton.value.$el)}

		// It's a dynamic question (without id)
		if (props.question.id === undefined) {
			emits("validate", event)
			return
		}

		theQuestion.user.correct = event.result

		// need answer (string: min1), , result (boolean)
		// Save the information to the database if the user is logged in
		// and if the result is correct
		if(usePage().props.value.auth.user && event.result) {
			axios.post(route("questions.validate", [props.question.id]), {
				...event
			}).then(res => {
				emits("validate", event)
			})
		}else{
			emits("validate", event)
		}
	}

// Gestion administrateur
let editMode = inject("editMode", false),
	showEditForm = ref(props.question.isNew === true),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Questions/QuestionForm")
		)
	}),
	duplicateQuestion = function(){
		axios.post(route("questions.duplicate", [theQuestion.id]))
			.then((res)=>{
				emits("duplicate", res.data.data)
				flash.add("la question a bien été dupliquée !")
			})
	},
	addIllustration = function() {
		if(theQuestion.block.illustration){
			console.log("Il y a déjà une illustration", theQuestion.id)
		}else{
			// Create a new illustration
			axios.post(route("blocks.illustrations.store", [theQuestion.block.id]), {})
				.then(res => {
					res.data.isNew = true
					theQuestion.block.illustration = res.data

					flash.add("une nouvelle illustration a été créée")
				})
		}
	}
</script>
