<template>
	<article>
		<question-show
			class="max-w-xl mx-auto bg-white border rounded"
			:question="props.question"
			show-title
			show-input
			is-minimal
			single-answer
			@validate="$emit('validate')"
		/>
	</article>
</template>

<script setup>
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

const emits = defineEmits(["validate"])
let props = defineProps({
	quizz: {type: Object, required: true},
	question: {type: Object, required: true}
})
</script>
