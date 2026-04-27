<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"
import Card from "@/Components/Ui/Card.vue"
import {EvaluationInterface} from "@/types/evaluationInterfaces.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ref} from "vue"
import {ScoreInterface, ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

interface IEvaluationStat {
	total: number,
	correct: number,
	incorrect: number,
	pending: number,
}

const props = defineProps<{
	evaluation: EvaluationInterface
}>()

const evaluationStat = ref<IEvaluationStat>({
	total: props.evaluation.questions.length,
	correct: 0,
	incorrect: 0,
	pending: 0
})

const scoreStore = useStoreScore()
const questionIds: number[] = props.evaluation.questions.map(question => question.id)

scoreStore
	.getScores("Question", questionIds)
	.then((scores: ScoreInterface<ScoreQuestionDataInterface>[]) => {
		scores.forEach(score => {
			if (score.attempts > 0) {
				if (score.is_resolved) evaluationStat.value.correct++
				else evaluationStat.value.incorrect++
			} else {
				evaluationStat.value.pending++
			}
		})
	})
</script>

<template>
	<Card :success="evaluationStat.correct===evaluationStat.total && evaluationStat.total>0">
		<div class="space-y-12">
			<div class="flex flex-col items-center">
				<h3
					v-katex.auto="evaluation.title"
					class="text-2xl"
				/>
				<div class="font-code text-xs">
					{{ evaluation.slug }}
				</div>
			</div>

			<div class="flex flex-col items-center gap-3">
				<p class="text-2xl">
					{{ evaluationStat.total }} questions
				</p>
				<div class="flex gap-8 text-4xl">
					<p class="text-green-600 flex">
						{{ evaluationStat.correct }} <i class="bi bi-check" />
					</p>
					<p class="text-red-600 flex">
						{{ evaluationStat.incorrect }}<i class="bi bi-x" />
					</p>
				</div>
			</div>
			<div class="flex w-full justify-center gap-3">
				<sc-button
					:href="route('students.evaluations.show', {evaluation: evaluation.id})"
					type="primary"
				>
					faire l'évaluation
				</sc-button>
			</div>
		</div>
	</Card>
</template>

<style scoped>

</style>
