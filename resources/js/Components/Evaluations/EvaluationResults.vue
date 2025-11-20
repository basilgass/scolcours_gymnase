<script setup lang="ts">

import {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"

const props = defineProps<{
	evaluation: EvaluationInterface,
	questions: QuestionInterface[]
}>()

const result = computed(() => {
	return props.questions.filter(question => question.user.is_resolved).length
})
</script>

<template>
	<article>
		<div class="grid place-items-center my-10">
			<div class="border border-content text-3xl rounded-lg py-5 px-10 text-center space-y-3">
				<div>votre évaluation</div>
				<div>{{ result }} / {{ props.questions.length }}</div>
			</div>
		</div>
		<div class="space-y-1 text-lg border-content">
			<div
				v-for="question in questions"
				:key="`question-${question.id}`"
				class="border-content border rounded px-3 py-2 flex justify-between"
				:class=" question.user.is_resolved
					? 'border-green-500 bg-green-50'
					: 'border-red-500 bg-red-50' "
			>
				<div>question {{ question.order }}</div>
				<i
					v-if="question.user.is_resolved"
					class="bi bi-check"
				/>
				<i
					v-else
					class="bi bi-plus-lg rotate-45"
				/>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
