<script lang="ts" setup>
/**
 * Affichage du clavier en fonction de la question:
 *    - choix du clavier en fonction du paramètre
 *    - checking de la réponse
 *    - emission des résultats, validation
 */
import QuestionAnswerSelector from "@/Components/Questions/Parts/QuestionAnswerSelector.vue"
import QuestionAnswerValidation from "@/Components/Questions/Parts/QuestionAnswerValidation.vue"
import {computed, inject, useTemplateRef} from "vue"
import {
	keyboardComponentType,
	questionDataInterface,
	questionResultInterface
} from "@/Components/Questions/QuestionInterface.ts"
import QuestionAnswerToggleKeyboard from "@/Components/Questions/Parts/QuestionAnswerToggleKeyboard.vue"
import type {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const questionData = inject<questionDataInterface>("questionData")

// Define the emits
defineEmits<{
	validate: [event: questionResultInterface]
}>()

// Cette partie est utilisée pour afficher la réponse depuis l'extérieur.
const keyboardComponentsRefs = useTemplateRef<keyboardComponentType[]>('keyboardComponent')

defineExpose({
	getKeyboards(): Record<number, keyboardComponentType> {

		const obj: Record<number, keyboardComponentType> = {}
		keyboardComponentsRefs.value.forEach(kbrd => {
			const index = +kbrd.$el.getAttribute('data-index')

			obj[index] = kbrd
		})

		return obj
	}
})


/**
 * Get then format of the answer
 */
const answerFormat = computed(() => {

	// No keyboard for this answer...
	if (!questionData.current.keyboard) return ""

	// The keyboard is a "basic" keyboard.
	if (questionData.current.keyboard.value.name === "Basic") {

		const customOutput = questionData.current.keyboard.value.parameters
			.filter((x) => x.startsWith("format:"))
			.map((x) => x.split("format:")[1])[0]

		return (
			customOutput ??
			questionData.current.checker.value.checker.format
		)
	}

	return questionData.current.checker.value.checker.format
})

function updateQuestion(event: KeyboardInputInterface, index: number) {
	questionData.user.answers.value[index] = event
}

const keyboardParameters = computed(() => {
	if (!questionData.config.editorMode) {
		return ""
	}
	if (questionData.current.keyboard.value.name === '') {
		return ''
	}
	if (!keyboardComponentsRefs.value) {
		return ""
	}
	const id = questionData.current.id.value
	return keyboardComponentsRefs.value[id].parameters
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
					:checker="questionData.current.checker.value"
					@validate="$emit('validate', $event )"
				/>
			</suspense>

			<!-- keyboard component -->
			<component
				:is="validator.keyboard.component"
				v-for="(validator, index) in questionData.validators.value"
				v-show="questionData.current.id.value === index"
				:key="`keyboard-id-${index}`"
				ref="keyboardComponent"
				:data-index="index"
				:keyboard="validator.keyboard"
				:reference="validator.answer"
				class="touch-manipulation"
				@change="updateQuestion($event, index)"
			/>

			<div
				v-if="questionData.config.editorMode && keyboardComponentsRefs"
				class="fixed left-2 bottom-2 w-[60vw] md:w-[40vw] lg:w-[30vw] z-10"
			>
				<pre class="font-code text-[12px]! mt-5 bg-gray-200 border border-gray-300 p-3 shadow-sm rounded-sm">{{ keyboardParameters }}</pre>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
