<script setup lang="ts">

import {EvaluationInterface, QuestionInterface} from "@/types/modelInterfaces.ts"
import ItemsSelector from "@/Components/Evaluations/ItemsSelector.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {computed, ref} from "vue"
import {EVAL_STATUS, ITEM_STATUS} from "@/types/evaluationInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"

const props = defineProps<{
	evaluation: EvaluationInterface,
	questions: QuestionInterface[]
}>()

const currentStatus = defineModel<EVAL_STATUS>()

const questionIndex = ref(0)

function status(question: QuestionInterface): ITEM_STATUS {
	if (question.user === null ||
		question.user.data.answers.length === 0) return ITEM_STATUS.NEW

	if (question.user.is_resolved && props.evaluation.auto_control) return ITEM_STATUS.SUCCESS

	return ITEM_STATUS.PARTIAL
}

function validateQuestion(event: questionResultInterface) {
	console.log(event)
}

const allDone = computed(() => {
	return props.questions.every(question => question.user.data.answers.length > 0)
})
</script>

<template>
	<article class="py-5 space-y-10">
		<div
			v-if="allDone"
			class="grid place-items-center space-y-3"
		>
			<div>Toutes les questions ont au moins une réponse...</div>
			<sc-button
				type="success"
				@click="currentStatus = EVAL_STATUS.FINISHED"
			>
				Aller à la page des résultats
			</sc-button>
		</div>
		<div class="px-5">
			<items-selector
				v-model="questionIndex"
				:items="questions"
				:status
			/>

			<div class="overflow-hidden">
				<question-show
					v-for="(question, index) in questions"
					v-show="index===questionIndex"
					:key="`question-${question.id}`"
					:question
					class="mt-5"
					:hide-success="!evaluation.auto_control"
					show-input
					@validate="validateQuestion"
				/>
			</div>
		</div>
	</article>
</template>

<style scoped>

</style>
