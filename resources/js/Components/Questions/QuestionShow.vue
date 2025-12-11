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
import QuestionFooter from "@/Components/Questions/Parts/QuestionFooter.vue"
import QuestionBlock from "@/Components/Questions/Parts/QuestionBlock.vue"
import QuestionAnswer from "@/Components/Questions/Parts/QuestionAnswer.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {onMounted, provide, ref, useTemplateRef, watch} from "vue"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import {
	questionDataInterface,
	questionResultInterface,
	questionUserInputDisplayType
} from "@/Components/Questions/QuestionInterface.ts"
import QuestionHeader from "@/Components/Questions/Parts/QuestionHeader.vue"
import {useQuestion} from "@/Components/Questions/useQuestion.ts"

/**
 * question: QuestionInterface
 * locked: boolean - if true, the question cannot be answered (cover displayed)
 * showInput: questionUserInputDisplayType | '' | boolean - determine the keyboard visibility
 * isDynamic: boolean - if true, the question is generated dynamically, not from a database entry
 * editorMode: boolean - if true, the question is in editor mode (for preview)
 * blockOnly: boolean - if true, only the question block is displayed (no answer, no footer)
 * autoAnswer: boolean - if true, the question is automatically answered with default values
 * hideSuccess: boolean - if true, the success message and class is hidden
 */
const props = withDefaults(
	defineProps<{
		question: QuestionInterface,
		locked?: boolean,
		showInput?: questionUserInputDisplayType | '' | boolean,
		isDynamic?: boolean,
		editorMode?: boolean,
		blockOnly?: boolean,
		autoAnswer?: boolean,
		hideSuccess?: boolean,
	}>(),
	{
		locked: false,
		showInput: false,
		isDynamic: false,
		editorMode: false,
		display: false,
		autoAnswer: false,
		hideSuccess: false
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

/**
 * component reference to the QuestionAnswer component
 */
const questionAnswerWrapper = useTemplateRef<typeof QuestionAnswer>('questionAnswerWrapper')

const questionData = useQuestion(props.question, {
	animation: true,
	showInput: showUserInput,
	isDynamic: props.isDynamic,
	raw: props.question.keyboard,
	editorMode: props.editorMode,
	silent: props.hideSuccess,
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

function cleanAnswer(value: string): string {
	const answer = value.split('||')[0]

	if (answer.startsWith('@')) {
		return answer.substring(1)
	}

	return answer
}

async function loadAnswers(event: { show: boolean, value?: string }) {
	const kbrds = questionAnswerWrapper.value.getKeyboards()
	const nb = Object.keys(kbrds).length

	for (let index = 0; index < nb; index++) {
		const keyboard = kbrds[index]

		// Default value - on ne prend que la première si c'est une multi-valeur
		const value = cleanAnswer(questionData.answers.values.value[index])

		keyboard.setInput(
			event.show
				? (event.value ?? value)
				: ''
		)
			.then((x) => {
				questionData.user.answers.value[index] = x
			})
	}
}

// Used to load the answers dynamically
defineExpose({
	loadAnswers,
	questionData
})

onMounted(() => {
	if (props.autoAnswer) {
		setTimeout(() => {
			loadAnswers({show: true})
		}, 200)
	}
})

watch(() => props.autoAnswer, () => {
	loadAnswers({show: props.autoAnswer})
})
</script>

<template>
	<article
		:id="`question-${question.id}`"
		:class="{
			'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700':
				!questionData.hasSuccess.value,
			'bg-green-50 dark:bg-green-950 border-green-600/60':
				questionData.hasSuccess.value,
		}"
		class="flex flex-col rounded border h-full relative"
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

		<!-- Header: number, title -->
		<question-header
			:show-number="!blockOnly"
		/>

		<!-- the body and illustration of question (as block) -->
		<question-block />

		<!-- user input (format, answer selector, keyboard) -->
		<hr
			v-show="!blockOnly"
			:class="{
				'bg-content':
					!questionData.hasSuccess.value,
				'border-green-600/60':
					questionData.hasSuccess.value,
			}"
		>

		<question-answer
			v-show="!blockOnly"
			ref="questionAnswerWrapper"
			v-model:show-input="showUserInput"
			@validate="$emit('validate', $event)"
		/>

		<!-- Footer: show answer, admin answer quick edition -->
		<question-footer
			v-show="!blockOnly"
			@load-answers="loadAnswers"
		/>
	</article>
</template>
