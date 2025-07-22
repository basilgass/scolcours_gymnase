<script lang="ts" setup>
/**
 * Affichage du clavier en fonction de la question:
 *    - choix du clavier en fonction du paramètre
 *    - TODO: checking de la réponse
 *    - TODO: emission des résultats, validation
 */
import QuestionAnswerSelector from "@/Components/Questions/Parts/QuestionAnswerSelector.vue"
import QuestionAnswerValidation from "@/Components/Questions/Parts/QuestionAnswerValidation.vue"
import {computed, inject, useTemplateRef} from "vue"
import {
	keyboardComponentType,
	questionDataInterface,
	questionResultInterface,
	questionValidatorInterface
} from "@/Components/Questions/QuestionInterface.ts"
import QuestionAnswerToggleKeyboard from "@/Components/Questions/Parts/QuestionAnswerToggleKeyboard.vue"
import type {KeyboardInputInterface} from "@/Composables/useKeyboard.ts"

const questionData = inject<questionDataInterface>("questionData")

// Define the emits
defineEmits<{
	validate: [event: questionResultInterface]
}>()

// Current validator, keyboard and checker
const currentValidator = computed<questionValidatorInterface>(() => {
	return questionData.validators.value[questionData.current.id.value]
})

/**
 * Get then format of the answer
 */
const answerFormat = computed(() => {

	// No keyboard for this answer...
	if (!currentValidator.value) return ""

	// The keyboard is a "basic" keyboard.
	if (currentValidator.value.keyboard.name === "Basic") {

		const customOutput = currentValidator.value.keyboard.parameters
			.filter((x) => x.startsWith("format:"))
			.map((x) => x.split("format:")[1])[0]

		return (
			customOutput ??
			currentValidator.value.checker.checker.format
		)
	}

	return ""
})

function updateQuestion(event: KeyboardInputInterface, index: number) {
	questionData.user.answers.value[index] = event
}

// Update the keyboard on question global data.
// const keyboardUI = ref<keyboardComponentType[]>(null)
const keyboardComponentsRefs = useTemplateRef<keyboardComponentType[]>('keyboardComponent')

// // TODO: can be removed ?
defineExpose({
	getKeyboards(): keyboardComponentType[] {
		return keyboardComponentsRefs.value
	}
})

</script>

<template>
	<div class="question-keyboard-wrapper">
		<!-- answer format -->
		<div
			v-katex.auto="answerFormat"
			class="text-center text-xs text-gray-500 my-2"
		/>

		<!-- user input toggle buttons -->
		<question-answer-toggle-keyboard
			v-if="questionData.config.showInput.value!=='force'"
		/>

		<div
			v-show="questionData.config.showInput.value!=='hide'"
			class="px-3"
		>
			<!-- answerId selector -->
			<question-answer-selector />

			<suspense>
				<question-answer-validation
					:checker="currentValidator.checker"
					@validate="$emit('validate', $event )"
				/>
			</suspense>

			<!-- keyboard component -->
			<component
				v-for="(validator, index) in questionData.validators.value"
				:is="validator.keyboard.component"
				:key="`keyboard-id-${index}`"
				ref="keyboardComponent"
				v-show="questionData.current.id.value === index"
				:reference="validator.answer"
				:keyboard="validator.keyboard"
				@change="updateQuestion($event, index)"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
