<script lang="ts" setup>
import {ChallengeAnswerInterface} from "@/Components/Challenges/ChallengeGame.vue"
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {useGenerator} from "@/Composables/useGenerator"
import type {GeneratorInterface, QuestionInterface} from "@/types/modelInterfaces"
import {computed, ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"

const props = defineProps<{
	generator: GeneratorInterface
}>()

/**
 * The current question counter, used to updated correctly the question
 */
const counter = ref(0)

/**
 * Lesson information
 */
// const lessonScore = useStoreLesson()
// const {score: scoreValue, update: scoreUpdate} = useScore(props.generator.user)

const scoreStore = useStoreScore()
const score = await scoreStore.getScore<ScoreChallengeDataInterface>('Generator', props.generator.id)

/**
 * Display the next question
 * @param checkerResult
 */
function nextQuestion(checkerResult: ChallengeAnswerInterface): void {
	if (checkerResult.result) {
		score.score++
		counter.value++

		// Update score value
		scoreStore.updateScore(score)

	} else {
		score.score = 0
	}
}

/**
 * The current question generated
 */
const theQuestion = computed(() => {
	if (counter.value >= 0) {
		return useGenerator(props.generator).question()
	}
	return false
})

</script>

<template>
	<div v-if="theQuestion">
		<question-show
			:key="`question-${counter}`"
			:question="theQuestion as QuestionInterface"
			class="max-w-[40em] mx-auto min-h-[500px] border border-gray-400"
			is-dynamic
			show-input
			@validate="nextQuestion"
		/>
	</div>
</template>
