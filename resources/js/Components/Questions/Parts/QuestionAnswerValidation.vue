<script lang="ts" setup>

import {computed, inject, nextTick, ref} from "vue"
import {questionDataInterface, questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import ScButton from "@/Components/Ui/scButton.vue"
import {useQuestionValidation} from "@/Components/Questions/useQuestionValidation.ts"
import {useWrongAnswerAnimation} from "@/Composables/useHelpers.ts"


const emits = defineEmits<{
	validate: [event: questionResultInterface]
}>()

const questionData = inject<questionDataInterface>("questionData")
const useValidation = useQuestionValidation(questionData)


function onValidate() {
	useValidation.validate()

	emits('validate', useValidation.result.value)

	// Animate the error if needed.
	if (
		!useValidation.result.value.result &&
		questionData.config.animation &&
		!questionData.config.silent
	) {
		useWrongAnswerAnimation(useValidation.button.value.$el)
	}
}

const answerIntegrityCheck = computed(() => {
	const id = questionData.current.id.value
	const checker = questionData.validators.value[id].checker.checker.checker
	const answer = questionData.validators.value[id].answer

	const integrity = checker.checkFormat(answer)

	return integrity === '' ? true : integrity
})

const closeErrors = ref(false)
const showErrors = computed(() => {
	return !closeErrors.value && useValidation.errors.value.length > 0
})

function closingErrors() {
	closeErrors.value = true

	nextTick(() => {
		useValidation.errors.value = []
		closeErrors.value = false
	})
}

</script>

<template>
	<div class="question-validation-wrapper">
		<div class="max-w-xl mx-auto keyboard mb-5">
			<sc-button
				ref="validateButton"
				:class="{
					'cursor-not-allowed': useValidation.lock.value,
				}"
				:disabled="useValidation.lock.value || useValidation.answersCount.value===0"
				class="key-cmd w-full"
				theme
				@click="onValidate"
			>
				<p v-if="useValidation.lock.value">
					{{ useValidation.buttonLabel }}
				</p>
				<p
					v-else-if="useValidation.answersCount.value===0"
					class="font-extralight"
				>
					Entrer une réponse...
				</p>
				<p v-else-if="useValidation.answersCount.value<useValidation.count">
					{{ useValidation.answersCount.value }} réponse(s) sur {{ questionData.answers.values.value.length }}
				</p>
				<p v-else>
					<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
				</p>
			</sc-button>
		</div>

		<!-- Error messages -->
		<transition
			name="fade"
			@after-leave="closingErrors()"
		>
			<div
				v-if="showErrors"
				class="max-w-xl mx-auto
			 p-3  my-2
			border rounded relative
			text-red-600 dark:text-red-100
			bg-red-100 dark:bg-red-900
			border-red-600 dark:border-red-700"
			>
				<button
					class="absolute top-1 right-1 text-xs"
					@click="closeErrors = true"
				>
					<i class="bi bi-x-lg" />
				</button>

				<div
					v-for="(msg, index) in useValidation.errors.value"
					:key="`error-${index}`"
					v-katex.auto="msg"
					class="text-xs"
				/>
			</div>
		</transition>

		<div
			v-if="answerIntegrityCheck!==true"
			v-katex.auto="answerIntegrityCheck"
			class="p-3  my-2
			border rounded
			text-red-600 dark:text-red-100
			bg-red-100 dark:bg-red-900
			border-red-600 dark:border-red-700"
		/>
	</div>
</template>

<style scoped>

</style>
