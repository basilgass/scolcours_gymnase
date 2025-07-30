<script lang="ts" setup>
/**
 * QuestionShow
 * 1. QuestionHeader -> question number, admin bar (edit link, show/hide constraint
 * 2. QuestionBlock -> display the text / illustration and incorporate the answers
 * 3. QuestionAnswer ->
 *      3.a answer format
 *      3.b btn to open / close the keyboard.
 *      3.c. question selector
 *      3.c question validation
 *      3.d keyboard display
 * 4. QuestionFooter -> show answer, admin answer quick edition
 */

/**
 * TODO: Article class : simplify and remove the isMinimal prop
 *
 */

import QuestionFooter from "@/Components/Questions/Parts/QuestionFooter.vue"
import QuestionBlock from "@/Components/Questions/Parts/QuestionBlock.vue"
import QuestionAnswer from "@/Components/Questions/Parts/QuestionAnswer.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {provide, ref, useTemplateRef} from "vue"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import {
	keyboardComponentType,
	questionDataInterface,
	questionResultInterface,
	questionUserInputDisplayType
} from "@/Components/Questions/QuestionInterface.ts"
import QuestionHeader from "@/Components/Questions/Parts/QuestionHeader.vue"
import {useQuestion} from "@/Components/Questions/useQuestion.ts"

// Props
const props = withDefaults(
	defineProps<{
		question: QuestionInterface,
		locked?: boolean,
		showInput?: questionUserInputDisplayType | '' | boolean,
		singleAnswer?: boolean,
		isDynamic?: boolean,
		editorMode?: boolean
	}>(),
	{
		locked: false,
		showInput: false,
		singleAnswer: false,
		isDynamic: false,
		editorMode: false
	}
)

// EditMode is used to determine the locked status
const editMode = useStoreEditMode()

// Emits validate
defineEmits<{
	validate: [event: questionResultInterface]
}>()


/**
 * Determiner the state of the keyboard visibility.
 * hide: the keyboard is hidden and can be toggled
 * show: the keyboard is visible and can be toggled
 * force: the keyboard is visible and CANNOT be toggled.
 */
const showUserInput = ref<questionUserInputDisplayType>(
	props.showInput === false ? 'hide' :
		props.showInput === true ? 'show' :
			props.showInput === '' ? 'show' :
				props.showInput
)

const questionAnswerWrapper = useTemplateRef<typeof QuestionAnswer>('questionAnswerWrapper')


// REFACTOR: Duplicata entre questionData.question.user = questionData.user.score
const questionData = useQuestion(props.question, {
	animation: true,
	showInput: showUserInput,
	isDynamic: props.isDynamic,
	raw: props.question.keyboard,
	editorMode: props.editorMode
})
/**
 * QuestionAnswer: .validators, .user.answers, .config, .answerId
 * QuestionAnswerSelector: .answers, .answerId
 * QuestionAnswerToggleKeyboard: .config
 * QuestionAnswerValidation: .user.answers, .validators, .user.score, .question.id, .config, .answers
 * QuestionBlock: .answersCoherences, .question.block, .answersVariables, .user.answers, .answerId
 * QuestionFooter: .user.score, .question.answer, .question.id
 * Keyboards***: .config
 *
 * Valeurs utiles:
 */
provide<questionDataInterface>("questionData", questionData)

async function loadAnswers(show: boolean) {
	questionAnswerWrapper.value.getKeyboards().forEach((keyboard, index) => {
		keyboard.setInput(show ?
			questionData.answers.values.value[index] :
			'')
			.then((x) => {
				questionData.user.answers.value[index] = x
			})
	})
}

// Used to load the answers dynamically
defineExpose({
	loadAnswers,
	questionData
})


</script>

<template>
	<article
		:id="`question-${question.id}`"
		:class="{
			'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700':
				!questionData.user?.score.value?.is_resolved,
			'bg-green-50 dark:bg-green-950 border-green-600/60':
				questionData.user?.score.value?.is_resolved,
		}"
		class="flex flex-col rounded border h-full"
	>
		<!-- Cover if question cannot yet be answered -->
		<transition name="fade">
			<div
				v-if="locked && !editMode.enable"
				v-theme.gradient
				class="w-full h-full
				font-extralight text-lg
				min-h-[5em] px-5 absolute inset-0
				z-10 grid
				text-center place-items-center"
			>
				<i class="bi bi-question-lg text-8xl text-gray-300" />
			</div>
		</transition>

		<!-- Header: number, title and admin -->
		<question-header :question />

		<!-- the body and illustration of question (as block) -->
		<question-block />

		<!-- user input (format, answer selector, keyboard) -->
		<hr
			:class="{
				'bg-content':
					!questionData.user.score.value?.is_resolved,
				'border-green-600/60':
					questionData.user.score.value?.is_resolved,
			}"
		>

		<question-answer
			ref="questionAnswerWrapper"
			v-model:show-input="showUserInput"
			@validate="$emit('validate', $event)"
		/>

		<!-- Footer: show answer, admin answer quick edition -->
		<question-footer
			@load-answers="loadAnswers"
		/>
	</article>
</template>
