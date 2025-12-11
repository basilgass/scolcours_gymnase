import {ComputedRef, Ref} from "vue"
import {BlockMinInterface, QuestionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import type KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import {KeyboardCheckerInterface, KeyboardInputInterface, KeyboardInterface} from "@/types/keyboardInterfaces.ts"

export type keyboardComponentType = InstanceType<typeof KeyboardBasic>
export type questionUserInputDisplayType = "hide" | "show" | "force"

export interface questionConfigInterface {
	animation: boolean,
	editorMode: boolean,
	isDynamic: boolean,
	raw: string,
	showInput: Ref<questionUserInputDisplayType>,
	silent: boolean,
}

export interface questionDataInterface {
	answers: {
		values: ComputedRef<string[]>,
		variables: ComputedRef<string[]>,
		coherences: ComputedRef<boolean>
	},
	block: ComputedRef<BlockMinInterface>,
	config: questionConfigInterface
	current: {
		id: Ref<number>,
		keyboard: ComputedRef<KeyboardInterface>,
		checker: ComputedRef<KeyboardCheckerInterface>
	},
	hasSuccess: ComputedRef<boolean>
	question: Ref<QuestionInterface>,
	user: {
		answer: Ref<string>
		answers: Ref<KeyboardInputInterface[]>,
		score: Ref<ScoreInterface>,
		errors: Ref<string[]>
	},
	validators: ComputedRef<questionValidatorInterface[]>,
}

export interface questionDataInterfaceOLD {
	// current answer id, if the question has more than one answer
	answerId: Ref<number>,
	answers: ComputedRef<string[]>,
	answersCoherences: ComputedRef<boolean>,
	// Score
	// list of all answers
	answersVariables: ComputedRef<string[]>,
	// updated body string, with the answers inserted.
	body: Ref<string>
	// - dynamic: determines if the question is dynamically built or is from DB.
	config: {
		animation: boolean,
		showInput: Ref<questionUserInputDisplayType>,
		isDynamic: boolean,
		raw: string,
		silent: boolean,
	},
	// user data
	// - answers: given by the user
	currentChecker: ComputedRef<KeyboardCheckerInterface>,
	// config of the current question
	// - animation: enables or disable animation (use for "single answer" (quizz)
	currentKeyboard: ComputedRef<KeyboardInterface>,
	// Question data from database
	question: Ref<QuestionInterface>,
	// - errors: list of errors once validated
	user: {
		answers: Ref<KeyboardInputInterface[]>,
		errors: Ref<string[]>,
		score: Ref<ScoreInterface>,
	},
	// Get the keyboard component, for access everywhere.
	validators: ComputedRef<questionValidatorInterface[]>,
}

export interface keyboardEventInterface {
	input: string,
	raw: string
	tex: string,
}

/**
 * Keyboard data:
 * key: $a
 * keyboard: contains the name, the component, ...
 * answer: string
 */

export interface questionValidatorInterface {
	answer: string,
	checker: KeyboardCheckerInterface,
	key: string,
	keyboard: KeyboardInterface,
}

export interface checkAnswerInterface {
	answer: string
	checker: KeyboardCheckerInterface,
	key: string,
}

export interface questionResultInterface {
	answer: string,
	result: boolean,
	tex: string
}
