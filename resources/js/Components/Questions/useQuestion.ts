import {QuestionInterface} from "@/types/modelInterfaces.ts"
import {computed, ref} from "vue"
import type {
	questionConfigInterface,
	questionDataInterface,
	questionValidatorInterface
} from "@/Components/Questions/QuestionInterface.ts"
import {useKeyboard} from "@/Composables/useKeyboard.ts"
import {KeyboardInputInterface} from "@/types/keyboardInterfaces.ts"

const {getKeyboards} = useKeyboard()


export function useQuestion(mayBeRefOrGetter: QuestionInterface, config: questionConfigInterface): questionDataInterface {
	function initAnswer() {
		return {input: "", tex: "", raw: ""}
	}

	// Raw question
	const question = ref(mayBeRefOrGetter)

	// Score object
	const userScore = ref(question.value.user)

	// List of all answers
	const correctAnswers = computed<string[]>(() => {
		return question.value.answer.split("\n").filter((x) => x !== "")
	})

	// List of all variables
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

	// List of all users answers.
	const userAnswers = ref<KeyboardInputInterface[]>(
		correctAnswers.value.map(() => {
			return initAnswer()
		})
	)

	// Determines if the number of answers is the same as the number of variables.
	const answersCoherences = computed(() => {
		return correctAnswers.value.length === answersVariables.value.length &&
			userAnswers.value.length === answersVariables.value.length
	})

	// List of validators.
	const validators = computed<questionValidatorInterface[]>(() => {
		// The keyboard is wrong...
		if (!question.value.keyboard) {
			return []
		}

		// Get the keyboards
		const arr: questionValidatorInterface[] = []

		const loop = question.value.keyboard.toLowerCase().endsWith('\n\nloop')

		const questionKeyboards = loop
			? question.value.keyboard.substring(0, question.value.keyboard.length - 6)
			: question.value.keyboard

		const keyboard_and_checker_arr = getKeyboards(questionKeyboards)

		const keyboardCount = keyboard_and_checker_arr.length

		// Loop over each answer.
		correctAnswers.value.forEach((answer: string, index: number) => {
			// Mode 1 : le dernier "keyboard" est le clavier de référene.
			// Mode 2 : les claviers sont sous forme de "loop"

			const {keyboard, checker} = loop
				? keyboard_and_checker_arr[index % keyboardCount]
				: keyboard_and_checker_arr[Math.min(keyboardCount - 1, index)]

			arr.push({
				key: "$" + ("abcdefghijklmnopqrstuvwxyz"[index]), // may be undefined !
				answer: answer,
				keyboard,
				checker
			})
		})

		return arr
	})

	// Current answer ID
	const answerId = ref<number>(0)
	// Current keyboard and checker for the answerID
	const currentKeyboard = computed(() => validators.value[answerId.value].keyboard)
	const currentChecker = computed(() => validators.value[answerId.value].checker)

	const hasSuccess = computed(() => {
		if (config.silent) return false

		return userScore.value?.is_resolved ?? false
	})
	return {
		question: {id: question.value.id},
		block: computed(() => question.value.block),
		current: {
			id: answerId,
			keyboard: currentKeyboard,
			checker: currentChecker
		},
		user: {
			answer: ref(""),
			answers: userAnswers,
			score: userScore,
			errors: ref<string[]>([])
		},
		answers: {
			values: correctAnswers,
			variables: answersVariables,
			coherences: answersCoherences
		},
		validators,
		config,
		hasSuccess
	}
}
