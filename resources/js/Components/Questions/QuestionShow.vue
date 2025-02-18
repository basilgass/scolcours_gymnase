<script lang="ts" setup>
/**
 * QuestionShow
 * 1. block -> display the text / illustration
 * 2. answer ->
 *      2.a answer format
 *      2.b btn to open / close the keyboard.
 *      2.c keyboard
 *      2.d show / hide answer
 */

import { ChallengeAnswerInterface } from "@/Components/Challenges/ChallengeGame.vue"
import KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import QuestionAnswerDisplay from "@/Components/Questions/QuestionAnswerDisplay.vue"
import QuestionBlock from "@/Components/Questions/QuestionBlock.vue"
import QuestionKeyboard from "@/Components/Questions/QuestionKeyboard.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { userAnswerInterface } from "@/types"
import type { QuestionInterface } from "@/types/modelInterfaces.ts"
import { computed, ComputedRef, nextTick, onMounted, PropType, provide, Ref, ref } from "vue"

// Props
const props = defineProps({
	question: { type: Object as PropType<QuestionInterface>, required: true },
	showInput: { type: Boolean, default: false },
	singleAnswer: { type: Boolean, default: false },
	locked: { type: Boolean, default: false },
	isMinimal: { type: Boolean, default: false }, // TODO: remove isMinimal prop.
	hideTitle: { type: Boolean, default: false } // TODO: remove hideTitle prop.
})

// EditMode is used to determine the locked status
const editMode = useStoreEditMode()

// Determine if the question is dynamic (not coming from the DB)
const isDynamic = props.question.id === undefined

// Emits validate
defineEmits<{
	validate: [event: ChallengeAnswerInterface]
}>()

/**
 * Determine if the question is locked or not
 */
const theQuestionLocked = computed(() => {
	//v-if="locked && !editMode.enabled.value"
	return props.locked && !editMode.enable
})


/**
 * Answer id - default is zero.
 */
const answerId = ref(0)

/**
 * Number of answers for the question
 */
const answersNumber = computed(
	() => props.question.answer.split("\n").filter((x) => x !== "").length
)

/**
 * User given answer.
 */
const userAnswers = ref<userAnswerInterface[]>([])

/**
 * Load answers to keyboardBlock based on the keyboards component.
 * @param show
 */
async function loadAnswer(show: boolean) {
	answerId.value = 0
	await nextTick()

	// if value is
	// true: loadAnswer
	// false: resetAnswer
	const timer = setInterval(() => {
		// Load the answer on the keyboard for each answer after 100ms

		if (keyboardComponent.value) {
			const kbrdComp:InstanceType<typeof KeyboardBasic> = keyboardComponent.value.getKeyboard()
			// We have the component.
			if (kbrdComp) {
					kbrdComp.loadAnswer(show ? props.question.answer.split("\n")[answerId.value] : '')
				// kbrdComp.loadAnswer(
				// 	show ? props.question.answer.split("\n")[answerId.value] : null
				// )
			}
		}

		// Go to the next part.
		if (answerId.value === answersNumber.value - 1) {
			clearInterval(timer)
			answerId.value = 0
		} else {
			answerId.value += 1
		}
	}, 100)
}

// Used to load the answers dynamically
defineExpose({ loadAnswer })

/**
 * Determiner the state of the keyboard visibility.
 * hidden: the keyboard is hidden and can be toggled
 * show: the keyboard is visible and can be toggled
 * force: the keyboard is visible and CANNOT be toggled.
 */
const showUserInput = ref<"hidden" | "show" | "force">(
	props.isMinimal ? "force" : props.showInput ? "show" : "hidden"
)

/**
 * Initialize the user's answers, based on the available number of answers
 */
const initUserAnswers = function() {
	// Reset userAnswers
	userAnswers.value = []

	// Create the list of empty answers.
	answers.value.forEach(() => {
		userAnswers.value.push({
			value: { input: "", tex: "", raw: "" },
			validation: {
				index: 0,
				result: false,
				message: ""
			}
		})
	})
}

/**
 * When the component is loaded, initialize the userAnswers reactive variable.
 */
onMounted(() => {
	// Load the userAnswers
	initUserAnswers()
})


// Provide data for all children components.
export interface questionDataInterface {
	// Question data from database
	question: Ref<QuestionInterface>,
	// updated body string, with the answers inserted.
	// TODO: Could be removed ?
	body: Ref<string>
	// current answer id, if the question has more than one answer
	answerId: Ref<number>,
	// list of all answers
	answers: ComputedRef<string[]>,
	answersVariables: ComputedRef<string[]>,
	answersCoherences: ComputedRef<boolean>,
	// user data
	// - answers: given by the user
	// - errors: list of errors once validated
	user: {
		answers: Ref<userAnswerInterface[]>,
		errors: Ref<string[]>
	},
	// config of the current question
	// - animation: enables or disable animation (use for "single answer" (quizz)
	// - dynamic: determines if the question is dynamically built or is from DB.
	config: {
		animation: boolean,
		dynamic: boolean
	},
	// Get the keyboard component, for access everywhere.
	keyboard: {
		component: Ref<InstanceType<typeof KeyboardBasic>>
	},
	// LoadAnswer function
	loadAnswer: (show: boolean) => void
}

const answers = computed(() => {
	return props.question.answer.split("\n").filter((x) => x !== "")
})

const answersVariables = computed(() => {
	// Get every "$<key> " values from block.body.
	const bodyText = props.question.block.body.toLowerCase()
	const regex = /\$[a-zA-Z](?=\\|\s|$)/g
	const matches = [...new Set([
		...bodyText.matchAll(regex)]
		.map(match => match[0][1])
	)]

	return matches ? matches : []
})

const answersCoherences = computed(() => {
	return answers.value.length === answersVariables.value.length &&
		userAnswers.value.length === answersVariables.value.length
})

provide<questionDataInterface>("questionData", {
	question: ref(props.question),
	body: ref(""),
	answerId,
	answers,
	answersVariables,
	answersCoherences,
	user: {
		answers: userAnswers,
		errors: ref([])
	},
	config: {
		animation: true,
		dynamic: isDynamic
	},
	keyboard: null,
	loadAnswer
})


const keyboardComponent = ref<InstanceType<typeof QuestionKeyboard>>(null)
</script>

<template>
	<article
		:id="`question-${question.id}`"
		:class="{
			'rounded-sm border h-full': !props.isMinimal,
			'bg-gray-50 border-gray-200':
				!props.question.user.result && !props.isMinimal,
			'bg-green-50 border-green-600/60':
				props.question.user.result && !props.isMinimal,
		}"
		class="relative flex flex-col"
	>
		<!-- Cover if question cannot yet be answered -->
		<transition name="fade">
			<div
				v-if="theQuestionLocked"
				class="w-full h-full font-extralight text-lg min-h-[5em] px-5 absolute inset-0 bg-linear-to-b from-gray-100 to-gray-50 z-10 grid text-center place-items-center"
			>
				<i class="bi bi-question-lg text-8xl text-gray-300" />
			</div>
		</transition>

		<!-- Header: number, title and admin -->
		<header class="flex flex-col relative">
			<!-- QUESTION NUMBER -->
			<div
				v-if="question.order && !props.isMinimal && !isDynamic"
				v-theme.bg.text="!theQuestionLocked"
				:class="{
					'draggable-handle cursor-move': editMode.enable,
					'bg-white': theQuestionLocked
				}"
				class="z-10 font-semibold font-code absolute left-1 -top-4 rounded-full border w-8 h-8 grid place-items-center draggable-handle"
			>
				{{ question.order }}
			</div>

			<!-- ADMIN HEADER -->
			<slot name="admin-header" />

			<!-- QUESTION TITLE -->
			<div
				v-if="!props.hideTitle"
				v-katex.auto="question.block.title"
				class="px-3 py-3 font-semibold text-lg"
			/>
		</header>

		<!-- the body and illustration of question (as block) -->
		<question-block />

		<!-- user input (format, answer selector, keyboard) -->
		<question-keyboard
			v-if="answersCoherences"
			ref="keyboardComponent"
			v-model:show-input="showUserInput"
			@validate="$emit('validate', $event)"
		/>

		<!-- user or admin answer -->
		<question-answer-display />
	</article>
</template>
