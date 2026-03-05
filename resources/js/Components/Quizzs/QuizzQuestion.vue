<script setup lang="ts">
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {QuestionInterface, ScoreInterface} from "@/types/modelInterfaces"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {onMounted, ref} from "vue"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

defineEmits(["validate"])
const props = defineProps<{
	question: QuestionInterface
}>()

const scoreStore = useStoreScore()
const score = ref<ScoreInterface<ScoreQuestionDataInterface>>(null)

const theQuestion = ref<QuestionInterface>(props.question)
onMounted(() => {
	scoreStore.getScore('Question', props.question.id)
		.then((res: ScoreInterface<ScoreQuestionDataInterface>) => {
			score.value = res
			theQuestion.value.user = res
		})

})
</script>

<template>
	<div>
		<div
			v-if="score===null"
			class="grid place-items-center min-h-50 font-code text-xl p-10"
		>
			<div>chargement de la question...</div>
		</div>
		<question-show
			v-else-if="score.data.answers.length===0"
			class="max-w-xl mx-auto bg-white border rounded-sm"
			:question="theQuestion"
			show-input
			hide-success
			@validate="$emit('validate')"
		/>
		<div
			v-else
			class="grid place-items-center min-h-50 font-code text-xl p-10"
		>
			<div class="space-y-5">
				<p>Vous avez déjà répondu à cette question.</p>
				<p>Merci de patienter...</p>
			</div>
		</div>
	</div>
</template>
