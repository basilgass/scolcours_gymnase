<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutProjection from "@/Layouts/LayoutProjection.vue"
import type {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces"
import {onMounted, ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ItemsSelector from "@/Components/Evaluations/ItemsSelector.vue"
import {ITEM_STATUS} from "@/types/evaluationInterfaces.ts"

defineOptions({layout: LayoutProjection})

let props = defineProps<{
	evaluation: EvaluationInterface
}>()


const theQuestions = ref<QuestionInterface[]>(props.evaluation.questions)
const questionIndex = ref(0)
const loading = ref(true)

function status(question: QuestionInterface): ITEM_STATUS {
	if (question.user === null ||
		question.user.data.answers.length === 0) return ITEM_STATUS.NEW

	if (question.user.is_resolved && props.evaluation.auto_control) return ITEM_STATUS.SUCCESS

	return ITEM_STATUS.PARTIAL
}

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
			loading.value = false
		})
})

function validateQuestion(event: questionResultInterface) {
	console.log(event)
}

</script>

<template>
	<article
		class="my-8 py-5 mx-auto max-w-xl bg-white rounded-lg border border-slate-300 min-h-screen"
	>
		<header class="px-5">
			<h2
				v-katex.auto="props.evaluation.title"
				class="text-3xl"
			/>
			<div class="font-extralight">
				{{ props.evaluation.slug }}
			</div>
		</header>

		<markdown-it
			:text="props.evaluation.body"
			class="px-5"
		/>

		<div
			v-if="theQuestions.length > 0 && !loading"
			class="px-5"
		>
			<items-selector
				v-model="questionIndex"
				:items="theQuestions"
				:status
			/>

			<div class="overflow-hidden">
				<question-show
					v-for="(question, index) in theQuestions"
					v-show="index===questionIndex"
					:key="`question-${question.id}`"
					:question
					class="mt-5"
					hide-success
					show-input
					@validate="validateQuestion"
				/>
			</div>
		</div>
		<div
			v-else
			class="font-code grid place-items-center min-h-[8em]"
		>
			En attente des questions
		</div>
	</article>
</template>


