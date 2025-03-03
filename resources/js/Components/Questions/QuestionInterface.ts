import {ComputedRef, Ref} from "vue"
import type {QuestionInterface} from "@/types/modelInterfaces.ts"
import type KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import type {KeyboardCheckerInterface, KeyboardInputInterface, KeyboardInterface} from "@/Composables/useKeyboard.ts"
import QuestionAnswer from "@/Components/Questions/Parts/QuestionAnswer.vue"

export type keyboardComponentType = InstanceType<typeof KeyboardBasic>
export type questionUserInputDisplayType = "hide" | "show" | "force"
export interface questionDataInterface {
	// Question data from database
	question: Ref<QuestionInterface>,
	// updated body string, with the answers inserted.
	body: Ref<string>
	// current answer id, if the question has more than one answer
	answerId: Ref<number>,
	// list of all answers
	answersVariables: ComputedRef<string[]>,
	answersCoherences: ComputedRef<boolean>,
	answers: ComputedRef<string[]>,
	// user data
	// - answers: given by the user
	// - errors: list of errors once validated
	user: {
		answers: Ref<KeyboardInputInterface[]>,
		errors: Ref<string[]>
	},
	// config of the current question
	// - animation: enables or disable animation (use for "single answer" (quizz)
	// - dynamic: determines if the question is dynamically built or is from DB.
	config: {
		animation: boolean,
		showInput: Ref<questionUserInputDisplayType>,
	},
	// Get the keyboard component, for access everywhere.
	validators: ComputedRef<questionValidatorInterface[]>,
	currentKeyboard: ComputedRef<KeyboardInterface>,
	currentChecker: ComputedRef<KeyboardCheckerInterface>,
}

export interface keyboardEventInterface {
	input: string,
	tex: string,
	raw: string
}
/**
 * Keyboard data:
 * key: $a
 * keyboard: contains the name, the component, ...
 * answer: string
 */

export interface questionValidatorInterface {
	key: string,
	answer: string,
	keyboard: KeyboardInterface,
	checker: KeyboardCheckerInterface,
}

export interface checkAnswerInterface {
	key: string,
	checker: KeyboardCheckerInterface,
	answer: string
}

export interface questionResultInterface {
	answer: string,
	result: boolean
}
