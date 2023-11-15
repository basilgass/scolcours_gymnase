import { unref } from "vue"
import {
	GeneratorInterface,
	QuestionMinInterface,
} from "@/types/modelInterfaces"

export function useGenerators(generators?: GeneratorInterface[]): {
	generator: (level: number) => GeneratorInterface
	code: (level: number) => string
	question: (value, challengeDefaults) => QuestionMinInterface
} {
	function getGenerator(level: number): GeneratorInterface {
		return unref(generators)[unref(level) - 1]
	}

	function question(value, challengeDefaults): QuestionMinInterface {
		const questionUnref = unref(value)
		const challengeDefaultsUnref = unref(challengeDefaults)

		return {
			body: "",
			block: {
				title: questionUnref.title
					? questionUnref.title
					: challengeDefaultsUnref.title,
				body: (questionUnref.output
					? questionUnref.output
					: challengeDefaultsUnref.output
				)
					.replace("question", questionUnref.question)
					.replace("answer", "$a"),
				illustration: null,
			},
			keyboard: questionUnref.keyboard
				? questionUnref.keyboard
				: challengeDefaultsUnref.keyboard,
			answer: "" + questionUnref.answer,
			user: {
				result: false,
			},
		}
	}

	const dftCode: string = `return {
	question: "erreur dans la génération de question",
	answer: "-",
	keyboard: {
		name: "",
		parameters: "exact"
	}
}`

	return {
		generator: (level: number) => getGenerator(level),
		code: (level: number) => getGenerator(level).code ?? dftCode,
		question: (value, challengeDefaults) =>
			question(value, challengeDefaults),
	}
}
