<!--
Affichage d'une question
Envoi de la validation d'une réponse
keyboard -> QuestionUserInput -> QuestionShow
-->
<template>
	<div
		:id="`question-${theQuestion.id}`"
		:class="{
			'bg-gray-50 border-gray-200': !theQuestion.user.correct,
			'bg-green-50 border-green-600/60': theQuestion.user.correct,
		}"
		class="relative rounded border h-full"
	>
		<div
			v-if="theQuestion.order"
			class="absolute -left-2 -top-2 rounded-full bg-white border w-8 h-8 text-xs flex justify-center items-center draggable-handle"
			:class="{'draggable-handle cursor-move':$page.props.auth.can.admin}"
		>
			{{ theQuestion.order }}
		</div>

		<div
			v-if="!dynamic"
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

		<div class="flex flex-col justify-between">
			<!-- the body of question -->
			<div class="px-5 py-3 overflow-x-auto">
				<illustration-show
					v-if="theQuestion.block.illustration"
					:illustration="theQuestion.block.illustration"
					class="bg-white"
				/>
				<markdown-it
					:text="theQuestionBody"
				/>

				<!-- answer format -->
				<div
					v-if="answerFormat"
					v-katex.auto="answerFormat"
					class="text-center text-xs text-gray-400 mt-5"
				/>
			</div>

			<!-- the user input container -->
			<div class="border-t border-gray-200 px-5 py-2">
				<!-- Open / Close user input -->
				<div
					v-if="!displayInput"
					:class="showInput?'text-right':'text-center'"
				>
					<button
						v-if="showInput"
						@click="showInput=!showInput"
					>
						<span class="text-xs font-ultralight">Fermer </span><i class="bi bi-x-lg" />
					</button>
					<button
						v-else
						class="w-full"
						@click="showInput=!showInput"
					>
						Donner la réponse
					</button>
				</div>

				<!-- user input -->
				<question-user-input
					v-show="showInput"
					ref="keyboardUI"
					:question="theQuestion"
					@change="theQuestionBody = $event"
					@validate="onValidate"
				/>
			</div>

			<!-- footer - display previous answers -->
			<div
				v-if="theQuestion.user.correct || $page.props.auth.can.admin"
				class="mt-5 border-t border-gray-200 px-5 py-2"
			>
				<button
					v-if="!showAnswer"
					class="text-xs text-gray-400 w-full"
					@click="showAnswer=true"
				>
					<i
						class="bi bi-eye mr-2"
					/>voir la réponse
				</button>
				<div
					v-else
					class="cursor-pointer"
					@click="showAnswer=false"
				>
					<div
						v-if="displayAnswer.tex"
						v-katex.display="displayAnswer.tex"
					/>
					<div
						v-if="displayAnswer.raw"
						v-html="displayAnswer.raw"
					/>
					<div
						class="text-xs text-center ml-3 font-code font-xs"
						v-text="theQuestion.answer"
					/>
				</div>
			</div>
		</div>

		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:question="props.question"
				@change="updateQuestion"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, defineAsyncComponent, inject, provide, ref} from "vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import QuestionUserInput from "@/Components/Posts/Questions/QuestionUserInput.vue"

let emits = defineEmits(["destroy", "validate", "duplicate"])

let editMode = inject("editMode")

let props = defineProps({
		question: {type: Object, required: true},
		displayInput: {type: Boolean, default :false},
		dynamic: {type: Boolean, default: false},
	}),
	keyboardUI = ref(null),
	theQuestion = ref(props.question),
	theQuestionBody = ref(props.question.block.body),
	showInput = ref(props.displayInput),
	showAnswer = ref(false),
	displayAnswer = computed(()=>{
		return {
			...keyboardUI.value.getAnswer(theQuestion.value.answer),
			code: theQuestion.value.answer
		}
	}),
	onValidate = function (event) {
		if (props.question.id === undefined) {
			emits("validate", {
				...event,
				question: theQuestionBody.value
			})
			return
		}
		theQuestion.value.user.correct = event.result

		// need answer (string: min1), , result (boolean)
		// Save the information to the database
		axios.post(route("questions.validate", [props.question.id]), {
			...event
		}).then(res => {
			emits("validate", {
				...event,
				question: theQuestionBody.value
			})
		})
	}

// Format edition / checker
let answerFormat = ref("")
provide("checkerFormat", {
	update: (value)=>{answerFormat.value = value}
})

let showEditForm = ref(props.question.isNew === true),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Questions/QuestionForm")
		)
	}),
	updateQuestion = function (q) {
		theQuestion.value = q
		theQuestionBody.value = theQuestion.value.block.body
	},
	duplicateQuestion = function(){
		axios.post(route("questions.duplicate", [theQuestion.value.id])).then((res)=>{
			emits("duplicate", res.data.data)
		})
	},
	addIllustration = function() {
		if(theQuestion.value.block.illustration){
			alert("EDIT")
		}else{
			// Create a new illustration
			axios.post(route("blocks.illustrations.store", [props.question.block.id]), {})
				.then(res => {
					res.data.isNew = true
					theQuestion.value.block.illustration = res.data

					flash.add("une nouvelle illustration a été créée")
				})
		}
	}
</script>
