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
		<div v-if="$page.props.auth.can.admin && editMode && !correctionMode">
			<BlockForm
				v-model="theQuestion.block"
				no-script
				no-data
				no-switch
				no-title
				no-type
				no-preview
			>
				<template #extraBtn>
					<confirm-button
						class="btn-xs btn-delete"
						@confirm="destroyQuestion"
					>
						<i class="bi bi-trash mr-2" />Supprimer
					</confirm-button>
				</template>
			</BlockForm>
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
import {computed, inject, onMounted, ref, watch} from "vue"
import {usePage} from "@inertiajs/inertia-vue3"
import katex from "katex/dist/katex.mjs"
import {keyboards} from "@/keyboards"
import QuestionItem from "@/Components/Posts/Questions/QuestionItem"
import QuestionFooter from "@/Components/Posts/Questions/QuestionFooter"
import BlockForm from "@/Components/Posts/Blocks/BlockForm.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"

let props = defineProps({
	question: {type: Object, required: true},
	correctionMode: {type: Boolean, default: false},
	questionNumber: {type: [Number, Boolean], default: false}
})

let emits = defineEmits(["destroy", "resolved"])

let userAnswerAsTex = ref(""),
	theQuestion = ref(props.question),
	showKeyboard = ref(false)

let editMode = inject("editmode")

let questionDisplay = ref(""),
	previousAnswers = computed(() => {
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
	}),
	formatQuestion = function () {
		//TODO: is formatQuestion still usefull ? Should be removed ?
		let body = theQuestion.value.body,
			answer

		// Check if the answer is a correct tex value
		try {
			katex.renderToString(userAnswerAsTex.value)
			answer = userAnswerAsTex.value
		} catch {
			answer = "\\color{red}{\\text{ ??? }}"
		}

		// The question may contain answer place holder...
		if(body.includes("$")){
			// variables MUST be in this order.
			let vnames = "abcdefghijklmnopqrstuvwxyz"

			answer = answer.split(",").filter(x=>x!=="")
			for(let i=0; i<vnames.length; i++){
				const key = "$"+vnames[i]
				if(body.includes(key)){
					if(i<answer.length) {
						body = body.replaceAll(key, answer[i])
					}else{
						body = body.replaceAll(key, `\\textcolor{red}{\\ ${vnames[i]} \\ }`)
					}
				}
			}
		}

		questionDisplay.value = body
	}

watch(userAnswerAsTex, () => {
	formatQuestion()
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
onMounted(() => {
	formatQuestion()
})
</script>
