<script setup lang="ts">

import {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces.ts"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {computed} from "vue"
import {EVAL_STATUS} from "@/types/evaluationInterfaces.ts"

const props = defineProps<{
	evaluation: EvaluationInterface,
	questions: QuestionInterface[]
}>()

const currentStatus = defineModel<EVAL_STATUS>()

const isStarted = computed(() => {
	return props.questions.some(question => question.user.data.answers.length > 0)
})
</script>

<template>
	<article>
		<markdown-it
			class="my-3 border-content border rounded p-3 bg-slate-50 dark:bg-slate-700"
			:text="props.evaluation.body"
		/>

		<div class="text-center text-sm font-code my-2">
			cette évaluation comporte {{ questions.length }} questions
		</div>
		<div class="flex justify-center">
			<sc-button
				type="primary"
				xl
				@click="currentStatus = EVAL_STATUS.RUNNING"
			>
				{{ isStarted ? 'continuer' : 'commencer' }} l'évaluation
			</sc-button>
		</div>
		<div class="space-y-1 text-lg border-content mt-10">
			<div
				v-for="question in questions"
				:key="`question-${question.id}`"
				class="border-content border rounded px-3 py-2 flex justify-between"
				:class=" question.user.data.answers.length ? 'border-green-500 bg-green-50': '' "
			>
				<div>question {{ question.order }}</div>
				<div>{{ question.user.data.answers.length ? 'répondu' : '' }}</div>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
