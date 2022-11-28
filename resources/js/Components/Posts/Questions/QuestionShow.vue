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
			:class="cursorOnNumber"
			@dblclick="editMode = $page.props.auth.can.admin?!editMode:false"
		>
			{{ questionNumber }}
		</div>

		<!-- Admin edition mode -->
		<QuestionItemAdmin
			v-model:question="theQuestion"
			:correction-mode="correctionMode"
			@destroy="emits('destroy', $event)"
			@duplicate="emits('duplicate', $event)"
			@updated="adminKey++"
		/>

		<!-- the body of question -->
		<QuestionItem
			:key="`admin-${adminKey}`"
			v-model:question="theQuestion"
			:question-number="questionNumber"
			:show-keyboard-toggle="!showKeyboard"
			:correction-mode="correctionMode"
			@validate="validateAnswer"
		/>

		<!-- footer - display previous answers -->
		<QuestionFooter
			v-if="!correctionMode"
			v-model:question="theQuestion"
			:is-correct="isCorrect"
		/>
	</div>
</template>

<script setup>
import {computed, inject, reactive, ref} from "vue"
import {usePage} from "@inertiajs/inertia-vue3"
import QuestionItem from "@/Components/Posts/Questions/QuestionItem"
import QuestionFooter from "@/Components/Posts/Questions/QuestionFooter"
import QuestionItemAdmin from "@/Components/Posts/Questions/QuestionItemAdmin.vue"

let props = defineProps({
	question: {type: Object, required: true},
	correctionMode: {type: Boolean, default: false},
	questionNumber: {type: [Number, Boolean], default: false},
	showKeyboard: {type: Boolean, default: false}
})

let emits = defineEmits(["destroy", "resolved", "validate", "duplicate"])

let theQuestion = reactive(props.question),
	adminKey = ref(1)

let editMode = inject("editpost", false)

let cursorOnNumber = computed(()=>{
	if(usePage().props.value.auth.can.admin){
		return editMode.value ? "cursor-move" : "cursor-pointer"
	}
	return ""
})


let isCorrect = computed(() => {
	if(!theQuestion){return false}
	if(!theQuestion.userAnswers){return false}

	if (theQuestion.userAnswers.length > 0) {
		if (theQuestion.userAnswers[theQuestion.userAnswers.length - 1].result) {
			return theQuestion.userAnswers[theQuestion.userAnswers.length - 1]
		} else {
			return false
		}
	}
	return false
})

function validateAnswer(checkerResult) {
	if(!theQuestion){return}

	if(theQuestion.id===undefined){
		emits("validate", theQuestion)
		return
	}

	if(!theQuestion.userAnswers){return}

	//TODO: maybe move validateAnswer from QuestionShow to QuestionItem. Make the component more "logical"
	const data = {
		answer: checkerResult.answer,
		result: checkerResult.result
	}

	if(usePage().props.value.auth.user) {
		axios.post(route("questions.validate", [theQuestion.id]),
			data
		).then(res => {
			theQuestion.userAnswers.push({...res.data, "when": "à l'instant"})
			if (res.data.result) {
				emits("resolved", theQuestion)
			} else {
				// Error !
			}
		})
	}else{
		theQuestion.userAnswers.push({...data, "when": "à l'instant"})
	}
}

</script>
