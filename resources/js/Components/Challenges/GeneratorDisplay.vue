<script lang="ts" setup>
import QuestionShow from "@/Components/Questions/QuestionShow.vue"
import {answerIsWrong, GeneratorParams, useGenerator} from "@/Composables/useGenerator"
import type {GeneratorInterface, QuestionInterface} from "@/types/modelInterfaces"
import {computed, onMounted, ref} from "vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreGeneratorDataInterface} from "@/types/scoreInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {resolveParameters} from "@/Composables/useGeneratorParameters.ts"

const props = defineProps<{
	generator: GeneratorInterface,
	parameters?: GeneratorParams
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
		// Si l'erreur est une broutille, ne pas pénaliser.
		if (answerIsWrong(checkerResult)) {
			// Le score retombe à zéro.
			score.data.current_score = 0
		}

		// Update score value
		scoreStore.updateScore(score)
	}
}

/**
 * The current question generated
 */
const theQuestion = computed(() => {
	const query = new URLSearchParams(window.location.search)
	const queryParams = Object.fromEntries(query.entries()) as Record<string, string>

	// Priorité : props.parameters > querystring. Les valeurs sont brutes (strings),
	// resolveParameters applique les defaults du schéma et caste selon le format.
	const overrides: Record<string, string> = {
		...queryParams,
		...(props.parameters as Record<string, string> ?? {})
	}

	const params = resolveParameters(props.generator.parameters_schema, overrides)

	if (counter.value >= 0) {
		return useGenerator(props.generator).question(undefined, params)
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
			class="max-w-[40em] mx-auto min-h-125 border border-gray-400"
			is-dynamic
			show-input
			@validate="nextQuestion"
		/>
	</div>
</template>
