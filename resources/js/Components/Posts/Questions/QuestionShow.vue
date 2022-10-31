<template>
	<div
		:id="`question-${theQuestion.id}`"
		class="px-5 py-3 relative"
		:class="{
			'unanswered': !isCorrect.result,
			'bg-gray-200 even:bg-gray-100': correctionMode,
			'rounded border': !correctionMode,
			'bg-gray-50 border-gray-200': !correctionMode && !isCorrect.result,
			'bg-green-50 border-green-600/60': !correctionMode && isCorrect.result,
		}"
	>
		<div
			v-if="questionNumber!==false"
			class="absolute -left-2 -top-2 rounded-full bg-white border w-8 h-8 text-xs flex justify-center items-center draggable-handle"
			:class="($page.props.auth.can.admin && editMode)?'cursor-move':''"
		>
			{{ questionNumber }}
		</div>

		<!-- Admin edition mode -->
		<div
			v-if="$page.props.auth.can.admin && editMode && !correctionMode"
			class="admin-wrapper flex-col"
		>
			<div class="admin-wrapper-row flex justify-between">
				<button
					class="btn-edit btn-xs"
					@click="editBlock=!editBlock"
				>
					éditer la donnée
				</button>

				<confirm-button
					class="btn-xs btn-delete"
					@confirm="destroyQuestion"
				>
					<i class="bi bi-trash mr-2" />Supprimer
				</confirm-button>

				<button
					class="btn-xs btn-add"
					@click="duplicateQuestion(theQuestion.id)"
				>
					<i class="bi bi-clipboard mr-2" />Dupliquer
				</button>
			</div>
			<div class=" admin-wrapper-row">
				<BlockForm
					v-show="editBlock"
					v-model="theQuestion.block"
					no-script
					no-data
					no-switch
					no-title
					no-type
					no-preview
					no-delete
					@close="editBlock=false"
				/>
			</div>
			<div class="admin-wrapper-row">
				<QuestionForm v-model="theQuestion" />
			</div>
		</div>

		<!-- the body of question -->
		<QuestionItem
			ref="questionUI"
			:question-number="questionNumber"
			:block="theQuestion.block"
			:answer="theQuestion.answer"
			:checker="theQuestion.checker"
			:keyboard="theQuestion.keyboard"
			:show-keyboard="showKeyboard"
			:show-keyboard-output="false"
			:show-keyboard-toggle="true"
			:correction-mode="correctionMode"
			@validate="validateAnswer"
		/>

		<!-- footer - display previous answers -->
		<div v-if="!correctionMode">
			<!-- Si la réponse est déjà donnée, afficher la réponse -->
			<QuestionFooter
				:is-correct="isCorrect"
				:answer="questionAnswerDisplay"
				:previous-answers="previousAnswers"
				:admin-answer="theQuestion.answer"
			/>
		</div>
	</div>
</template>

<script setup>
import {computed, inject, ref} from "vue"
import {usePage} from "@inertiajs/inertia-vue3"
import {keyboards} from "@/keyboards"
import QuestionItem from "@/Components/Posts/Questions/QuestionItem"
import QuestionFooter from "@/Components/Posts/Questions/QuestionFooter"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import QuestionForm from "@/Components/Posts/Questions/QuestionForm.vue"
import Button from "@/Components/Auth/Button.vue"

let props = defineProps({
	question: {type: Object, required: true},
	correctionMode: {type: Boolean, default: false},
	questionNumber: {type: [Number, Boolean], default: false}
})

let emits = defineEmits(["destroy", "resolved", "duplicate"])

let userAnswerAsTex = ref(""),
	theQuestion = ref(props.question),
	showKeyboard = ref(false),
	editBlock = ref(false)

let editMode = inject("editmode")

let previousAnswers = computed(() => {
		return theQuestion.value.userAnswers?.length === 0 ? [] : theQuestion.value.userAnswers
	}),
	isCorrect = computed(() => {
		if (theQuestion.value?.userAnswers.length > 0) {
			if (theQuestion.value.userAnswers[theQuestion.value.userAnswers.length - 1].result) {
				return theQuestion.value.userAnswers[theQuestion.value.userAnswers.length - 1]
			} else {
				return false
			}
		}
		return false
	}),
	questionAnswerDisplay = computed(() => {
		if (theQuestion.value.keyboard) {
			const kbrd = keyboards[theQuestion.value.keyboard]

			if (kbrd) {
				return kbrd.tex(props.question.answer)
			}
		}

		return props.question.answer
	})

let questionUI = ref(null)
function validateAnswer(checkerResult) {
	const data = {
		answer: checkerResult.answer,
		result: checkerResult.result
	}

	if(usePage().props.value.auth.user) {
		axios.post(route("questions.validate", [theQuestion.value.id]),
			data
		).then(res => {
			theQuestion.value.userAnswers.push({...res.data, "when": "à l'instant"})
			if (res.data.result) {
				emits("resolved", theQuestion)
				// Make sure the keyboard is now hidden
				showKeyboard.value = false
			} else {
				// Error !
			}
		})
	}else{
		theQuestion.value.userAnswers.push({...data, "when": "à l'instant"})
	}
}

function duplicateQuestion(id) {
	axios.post(route("questions.duplicate", [id]), )
		.then(res=>{
			//
			emits("duplicate", res.data)
		}).catch(res=>console.log("duplicate error", res.data))
}

function destroyQuestion() {
	axios.post(
		route("questions.destroy", [props.question.id]),
		{
			_method: "delete"
		}
	).then(res => {
		emits("destroy", props.question.id)
	})
}
</script>
