<template>
	<article class="mt-10">
		<question-show
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
import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

const emits = defineEmits(["validate"])
let props = defineProps({
	quizz: {type: Object, required: true},
	question: {type: Object, required: true}
})
</script>
