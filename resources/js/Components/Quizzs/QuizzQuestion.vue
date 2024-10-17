<script setup lang="ts">
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import { QuestionInterface } from "@/types/modelInterfaces"

defineEmits(["validate"])
let props = defineProps({
	quizz: {type: Object, required: true},
	question: {type: Object, required: true}
})
</script>

<template>
	<article>
		<question-show
			class="max-w-xl mx-auto bg-white border rounded"
			:question="props.question as QuestionInterface"
			show-input
			is-minimal
			single-answer
			@validate="$emit('validate')"
		/>
	</article>
</template>
