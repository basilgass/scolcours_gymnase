<script lang="ts" setup>
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces"
import {onMounted, ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import EvaluationIntro from "@/Components/Evaluations/EvaluationIntro.vue"
import EvaluationQuestions from "@/Components/Evaluations/EvaluationQuestions.vue"
import EvaluationResults from "@/Components/Evaluations/EvaluationResults.vue"
import {EVAL_STATUS} from "@/types/evaluationInterfaces.ts"
import {Link as InertiaLink} from "@inertiajs/vue3"

defineOptions({layout: LayoutProjection})

let props = defineProps<{
	evaluation: EvaluationInterface
}>()


const theQuestions = ref<QuestionInterface[]>(props.evaluation.questions)

const currentStatus = ref<EVAL_STATUS>(EVAL_STATUS.LOADING)
const storeScore = useStoreScore()

onMounted(() => {
	// Charger les scores des questions
	const ids = theQuestions.value
		.filter((question) => question.user === undefined)
		.map(question => question.id)

	storeScore.getScores<ScoreQuestionDataInterface>('Question', ids)
		.then(scores => {
			theQuestions.value = theQuestions.value.map((question) => {
				question.user = scores.find(score => score.scoreable_id === question.id)
				return question
			})
		})
		.finally(() => {
			currentStatus.value = EVAL_STATUS.INTRO
		})
})


</script>

<template>
	<article
		class="my-8 p-3 mx-auto max-w-xl bg-content border-content border rounded-lg min-h-screen"
	>
		<header class="flex justify-between">
			<div>
				<h2
					v-katex.auto="props.evaluation.title"
					class="text-3xl"
				/>
				<div class="font-extralight text-xs font-code">
					{{ props.evaluation.slug }}
				</div>
			</div>
			<div class="text-right">
				<InertiaLink
					:href="route('scolcours.index')"
					class="hover:font-semibold transition-all"
				>
					<i class="bi bi-house mr-2" />page d'accueil
				</InertiaLink>

				<div
					v-if="evaluation.auto_control"
					class="text-green-600"
				>
					<i class="bi bi-check mr-2" />validation
				</div>
				<div
					v-else
					class="text-red-500"
				>
					<i class="bi bi-exclamation-triangle mr-2" />aucune validation
				</div>
			</div>
		</header>


		<div
			v-if="currentStatus===EVAL_STATUS.LOADING"
			class="font-code grid place-items-center min-h-[8em]"
		>
			Chargement de l'évaluation
		</div>
		<evaluation-intro
			v-else-if="currentStatus===EVAL_STATUS.INTRO"
			:evaluation
			:questions="theQuestions"
			v-model="currentStatus"
		/>
		<evaluation-questions
			v-else-if="currentStatus===EVAL_STATUS.RUNNING"
			:evaluation
			:questions="theQuestions"
			v-model="currentStatus"
		/>
		<evaluation-results
			v-else-if="currentStatus===EVAL_STATUS.FINISHED"
			:evaluation
			:questions="theQuestions"
			v-model="currentStatus"
		/>
	</article>
</template>


