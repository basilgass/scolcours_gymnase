<script lang="ts" setup>
/**
 * Affiche la réponse en bas d'une question (si l'utilisateur l'a déjà répondu)
 * Pour l'admin, permet de modifier la réponse.
 */
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {computed, inject, ref, watch} from "vue"
import type {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

const editMode = useStoreEditMode()

const questionData = inject<questionDataInterface>("questionData")

const showAnswer = ref(false)

const emits = defineEmits<{
	loadAnswers: [{ show: boolean, value?: string }]
}>()

function toggleAnswer(value?: string) {
	showAnswer.value = value===undefined ? !showAnswer.value : true
	emits('loadAnswers', {show: showAnswer.value, value})
}


const previousAnswers = computed<string[]>(() => {
	return (questionData.user.score.value?.data as ScoreQuestionDataInterface)?.answers ?? []
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
					class="cursor-pointer hover:font-semibold"
					@click="toggleAnswer(a)"
				>
					{{ a }}
				</div>
			</div>
		</div>

		<div
			v-admin="editMode.enable"
			class="flex"
		>
			<button
				class="text-xs text-gray-400 px-2"
				@click="toggleAnswer"
			>
				<i
					v-if="showAnswer"
					class="bi bi-eye"
				/>
				<i
					v-else
					class="bi bi-eye-slash"
				/>
			</button>
		</div>
		<div v-if="questionData.user.score.value?.is_resolved">
			<button
				v-if="!showAnswer"
				class="text-xs text-gray-400 w-full"
				@click="toggleAnswer()"
			>
				<i class="bi bi-eye mr-2" />voir la réponse
			</button>

			<div
				v-else
				class="cursor-pointer overflow-x-auto scrollbar-scolcours"
				@click="toggleAnswer()"
			>
				<div
					class="text-xs text-center ml-3 font-code"
					v-text="questionData.answers.values"
				/>
			</div>
		</div>
	</div>
</template>


