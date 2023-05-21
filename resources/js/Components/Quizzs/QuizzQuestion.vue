<template>
	<article>
		<question-show-new
			class="max-w-xl mx-auto"
			:question="props.question"
			show-title
			minimal
			display-input
			@validate="$emit('validate')"
		/>
	</article>
</template>

<script setup>
import QuestionShowNew from "@/Components/Posts/Questions/QuestionShowNew.vue"

const emits = defineEmits(["validate"])
let props = defineProps({
	quizz: {type: Object, required: true},
	question: {type: Object, required: true}
})
</script>
