<script lang="ts" setup>
/**
 * Affiche la réponse en bas d'une question (si l'utilisateur l'a déjà répondu)
 * Pour l'admin, permet de modifier la réponse.
 */
import FormMaker from "@/Components/Form/FormMaker.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {inject, ref} from "vue"
import type {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"

const editMode = useStoreEditMode()

const questionData = inject<questionDataInterface>("questionData")

const showAnswer = ref(false)

const emits  = defineEmits<{
	loadAnswers: [ev: boolean]
}>()

function toggleAnswer(){
	showAnswer.value = !showAnswer.value

	emits('loadAnswers', showAnswer.value)
}
</script>

<template>
	<div
		v-if="questionData.question.value.user.result || $page.props.auth.can.admin"
		class="question-footer px-5 py-2"
	>
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
			<form-maker
				v-model="questionData.question.value.answer"
				:axios="{
					model: 'Question',
					id: questionData.question.value.id,
					column: 'answer',
					button: true
				}"
				class="flex-1 font-code"
				:rows="questionData.question.value.answer.split('\n').length"
				sm
				type="textarea"
			/>
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
					class="text-xs text-center ml-3 font-code font-xs"
					v-text="questionData.question.value.answer"
				/>
			</div>
		</div>
	</div>
</template>


