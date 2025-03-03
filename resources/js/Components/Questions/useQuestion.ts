import {QuestionInterface} from "@/types/modelInterfaces.ts"
import {computed, nextTick, ref} from "vue"
import type {questionValidatorInterface} from "@/Components/Questions/QuestionInterface.ts"
import {type KeyboardInputInterface, useKeyboard} from "@/Composables/useKeyboard.ts"
import QuestionAnswer from "@/Components/Questions/Parts/QuestionAnswer.vue"

const {getKeyboards} = useKeyboard()

export function useQuestion(mayBeRefOrGetter: QuestionInterface) {
	function initAnswer() {
		return {input: "", tex: "", raw: ""}
	}

	const question = ref(mayBeRefOrGetter)

	const answerId = ref<number>(0)

	const answers = computed<string[]>(() => {
		return question.value.answer.split("\n").filter((x) => x !== "")
	})

	const answersVariables = computed<string[]>(() => {
		// Get every "$<key> " values from block.body.
		const bodyText = question.value.block.body.toLowerCase()
		const regex = /\$[a-zA-Z](?=\\|\s|$)/g
		const matches = [...new Set([
			...bodyText.matchAll(regex)]
			.map(match => match[0][1])
		)]

		return matches ? matches : []
	})

	const userAnswers = ref<KeyboardInputInterface[]>(
		answers.value.map(() => {
			return initAnswer()
		})
	)

	const answersCoherences = computed(() => {
		return answers.value.length === answersVariables.value.length &&
			userAnswers.value.length === answersVariables.value.length
	})

	const validators = computed<questionValidatorInterface[]>(() => {
		// The keyboard is wrong...
		if (!question.value.keyboard) {
			return []
		}

		// Get the keyboards
		const arr: questionValidatorInterface[] = []
		const keyboard_and_checker_arr = getKeyboards(question.value.keyboard)

		// Loop over each answers.
		answers.value.forEach((answer: string, index: number) => {
			const {keyboard, checker} = keyboard_and_checker_arr[Math.min(keyboard_and_checker_arr.length - 1, index)]
			arr.push({
				key: "$" + ("abcdefghijklmnopqrstuvwxyz"[index]), // may be undefined !
				answer: answer,
				keyboard,
				checker
			})
		})

		return arr
	})

	const currentKeyboard = computed(() => validators.value[answerId.value].keyboard)
	const currentChecker = computed(() => validators.value[answerId.value].checker)

	// const keyboardComponent = ref<keyboardComponentType>(null)

	/**
	 * Load answers to keyboardBlock based on the keyboards component.
	 * @param show
	 * @param component
	 */

	return {
		question,
		answerId,
		answers,
		answersVariables,
		answersCoherences,
		userAnswers,
		validators,
		currentKeyboard,
		currentChecker,
	}
}
