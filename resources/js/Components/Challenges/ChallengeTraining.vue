<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {useGenerator} from "@/Composables/useGenerator"
import type {GeneratorInterface, QuestionInterface} from "@/types/modelInterfaces"
import {computed, onMounted, ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreGeneratorDataInterface} from "@/types/scoreInterfaces.ts"
import {ChallengeAnswerInterface} from "@/types/challengeInterface.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"

// TODO: remove the
const props = defineProps<{
	generator: GeneratorInterface
}>()

/**
 * The current question counter, used to updated correctly the question
 */
const counter = ref(0)

/**
 * Display the next question
 * @param checkerResult
 */

const scoreStore = useStoreScore()
const score = await scoreStore.getScore<ScoreGeneratorDataInterface>('Generator', props.generator.id)

function nextQuestion(checkerResult: questionResultInterface): void {
	if (checkerResult.result) {
		// Mise à jour du score.
		score.data.current_score++
		if (score.data.current_score > score.score) {
			// Amélioration du score actuel !
			score.score = +score.data.current_score
		}

		// Update score value
		scoreStore.updateScore(score)

		// Sélection de la question suivante.
		counter.value++
	} else {
		// Le score retombe à zéro.
		score.data.current_score = 0

		// Update score value
		scoreStore.updateScore(score)
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

onMounted(() => {
	// Lorsqu'on charge ce composant, le score doit être reseté
	scoreStore.resetScore(score)
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
