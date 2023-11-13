<script lang="ts">
	import LayoutProjection from "@/Layouts/LayoutProjection.vue"

	export default {
		layout: LayoutProjection,
	}
</script>
<script lang="ts" setup>
	import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
	import { PropType, ref } from "vue"
	import { EvaluationInterface } from "@/types/modelInterfaces"
	import QuestionShow from "@/Components/Posts/Questions/QuestionShow.vue"

	let props = defineProps({
		evaluation: {
			type: Object as PropType<EvaluationInterface>,
			required: true,
		},
	})

	let theQuestions = ref(props.evaluation.questions)
</script>

<template>
	<article>
		<h2 v-katex.auto="props.evaluation.title"></h2>

		<div>{{ props.evaluation.slug }}</div>
		<markdown-it :text="props.evaluation.body" />

		<div v-if="theQuestions.length > 0">
			<question-show
				v-for="question in theQuestions"
				:key="`question-${question.id}`"
				:question="question"
			/>
		</div>
	</article>
</template>

<style scoped></style>
