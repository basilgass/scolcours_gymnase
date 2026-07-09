<script lang="ts" setup>
/**
 * Affiche la réponse en bas d'une question (si l'utilisateur l'a déjà répondu)
 * Pour l'admin, permet de modifier la réponse.
 */
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {computed, inject, Ref, ref} from "vue"
import {questionDataKey} from "@/Components/Questions/QuestionInterface.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import {ScoreInterface} from "@/types/modelInterfaces.ts"

const editMode = useStoreEditMode()

const questionData = inject(questionDataKey)!


// on place score dans une variable pour indiquer que c'est un score d'une question.
const score = questionData.user.score as Ref<ScoreInterface<ScoreQuestionDataInterface>>

const showAnswer = ref(false)

const emits = defineEmits<{
	loadAnswers: [{ show: boolean, value?: string }]
}>()

function toggleAnswer(value?: string) {
	showAnswer.value = value === undefined ? !showAnswer.value : true

	emits('loadAnswers', {show: showAnswer.value, value})
}


const previousAnswers = computed<string[]>(() => {
	return (score.value?.data as ScoreQuestionDataInterface)?.answers ?? []
})

</script>

<template>
	<div class="question-footer px-5 py-2">
		<div
			v-if="previousAnswers.length"
			class="font-code text-xs flex gap-2"
		>
			<div>vos réponses:</div>
			<div class="flex-1 flex flex-wrap gap-2">
				<div
					v-for="a in previousAnswers"
					:key="a"
					:class="[
						'cursor-pointer hover:font-semibold',
						a === score.data.answers[0] ? 'border px-1': ''
					]"
					@click="toggleAnswer(a)"
				>
					{{ a }}
				</div>
			</div>
		</div>

		<!-- admin ou réponse correcte : affichage du bouton pour afficher / cacher la bonne réponse -->
		<div
			v-if="editMode.enable || questionData.hasSuccess.value"
			class="flex mt-2"
		>
			<button
				class="text-xs text-gray-400 flex gap-2 border-t cursor-pointer"
				@click="toggleAnswer()"
			>
				<i :class="showAnswer ? 'bi bi-eye' : 'bi bi-eye-slash'" />

				<pre>{{ questionData.question.value.answer }}</pre>
			</button>
		</div>
	</div>
</template>


