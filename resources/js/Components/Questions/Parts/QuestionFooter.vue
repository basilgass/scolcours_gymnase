<script lang="ts" setup>
/**
 * Affiche la réponse en bas d'une question (si l'utilisateur l'a déjà répondu)
 * Pour l'admin, permet de modifier la réponse.
 */
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {computed, inject, ref} from "vue"
import type {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

const editMode = useStoreEditMode()

const questionData = inject<questionDataInterface>("questionData")

const showAnswer = ref(false)

const emits = defineEmits<{
	loadAnswers: [ev: boolean]
}>()

function toggleAnswer() {
	showAnswer.value = !showAnswer.value

	emits('loadAnswers', showAnswer.value)
}


const previousAnswers = computed<string[]>(() => {
	return (questionData.user.score.value?.data as ScoreQuestionDataInterface)?.answers ?? []
})
</script>

<template>
	<div
		v-if="questionData.user.score.value?.is_resolved || $page.props.auth.can.admin"
		class="question-footer px-5 py-2"
	>
		<div> {{ previousAnswers.join(', ') }}</div>
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
			<!--			<form-maker-->
			<!--				v-model="questionData.user.answer"-->
			<!--				:axios="{-->
			<!--					model: 'Question',-->
			<!--					id: questionData.question.id,-->
			<!--					column: 'answer',-->
			<!--					button: true-->
			<!--				}"-->
			<!--				class="flex-1 font-code"-->
			<!--				:rows="questionData.answers.values.length"-->
			<!--				sm-->
			<!--				type="textarea"-->
			<!--			/>-->
		</div>
		<div v-admin="false">
			<button
				v-if="!showAnswer"
				class="text-xs text-gray-400 w-full"
				@click="toggleAnswer"
			>
				<i class="bi bi-eye mr-2" />voir la réponse
			</button>

			<div
				v-else
				class="cursor-pointer overflow-x-auto scrollbar-scolcours"
				@click="toggleAnswer"
			>
				<div
					class="text-xs text-center ml-3 font-code"
					v-text="questionData.answers.values"
				/>
			</div>
		</div>
	</div>
</template>


