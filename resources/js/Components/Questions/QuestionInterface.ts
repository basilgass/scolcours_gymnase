import {ComputedRef, InjectionKey, Ref} from "vue"
import {BlockMinInterface, QuestionInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import type KeyboardBasic from "@/Components/Keyboards/KeyboardBasic.vue"
import {KeyboardCheckerInterface, KeyboardInputInterface, KeyboardInterface} from "@/types/keyboardInterfaces.ts"
import {CheckerResult} from "@/Checkers"

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
		score: Ref<ScoreInterface | undefined>,
		errors: Ref<string[]>
	},
	validators: ComputedRef<questionValidatorInterface[]>,
}

export const questionDataKey: InjectionKey<questionDataInterface> = Symbol('questionData')

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

export interface questionResultInterface {
	answer: string,
	result: boolean,
	tex: string,
	validations: CheckerResult[]
}
