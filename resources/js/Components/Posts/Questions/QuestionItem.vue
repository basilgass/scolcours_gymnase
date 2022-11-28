<template>
	<div class="question-wrapper overflow-x-auto relative">
		<!-- Question display -->
		<div>
			<illustration-show
				v-if="questionIllustration.length>0 && !correctionMode"
				class="bg-white"
				:illustration="questionIllustration[0]"
			/>
			<markdown-it
				:katex-class="correctionMode?'katex-left':''"
				:text="questionBody"
			/>
		</div>

		<QuestionItemUserInput
			ref="questionUserInput"
			v-model:question="theQuestion"
			:correction-mode="correctionMode"
			:show-keyboard-toggle="showKeyboardToggle"
			@updated="questionBody = $event"
			@validate="validateUserInput"
		/>
	</div>
</template>

<script setup>
import {computed, reactive, ref, watch} from "vue"
import QuestionItemUserInput from "@/Components/Posts/Questions/QuestionItemUserInput.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"

let emits = defineEmits(["validate", "update:question"])

let props = defineProps({
	question: {type: Object, required: true},
	output: {type: String, default: "question = answer"},
	showKeyboard: {type: Boolean, default: false},
	showKeyboardOutput: {type: Boolean, default: false},
	showKeyboardToggle: {type: Boolean, default: false},
	correctionMode: {type: Boolean, default: false}
})

let theQuestion = reactive(props.question),
	questionBody = ref(props.question.block.body),
	questionIllustration = ref(props.question.block.illustrations),
	checkerResult = ref({
		result: null,
		message: ""
	})

let validateUserInput = function(event){
	checkerResult.value.result = event.result
	checkerResult.value.message = event.message

	emits("validate", event)
}

let questionUserInput = ref(null)
let keyboard = computed(()=>{
	if(questionUserInput.value.keyboard){
		return questionUserInput.value.keyboard
	}else{
		return null
	}
})

watch(()=>props.question.block.body, (after, before)=>{
	if(questionUserInput.value){
		questionUserInput.value.updateBody()
	}
} )
defineExpose({keyboard})
</script>
