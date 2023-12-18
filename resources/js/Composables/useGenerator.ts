/* useGenerators
 * Récupération, création de question à partir d'un générateur donné.
 */
import { ComputedRef, Ref, unref } from "vue"
import {
	GeneratorInterface,
	QuestionMinInterface,
} from "@/types/modelInterfaces"
import { PiMath } from "pimath/esm"
import { generatedQuestionInterface } from "@/types"

export function useGenerator(generator: ComputedRef<GeneratorInterface>): {
	code: string
	question: (value?: generatedQuestionInterface) => QuestionMinInterface
	list: (n: number) => generatedQuestionInterface[]
	random: () => generatedQuestionInterface
} {
	function question(
		value?: Ref<generatedQuestionInterface> | generatedQuestionInterface,
	): QuestionMinInterface {
		if (value === undefined) value = randomQuestion()

		const questionUnref = unref(value)
		const generatorUnref = unref(generator)

		return {
			body: "",
			block: {
				title: questionUnref.title ?? "",
				body: generatorUnref.template
					.replace("question", questionUnref.question)
					.replace("answer", "$a"),
				illustration: null,
			},
			keyboard: questionUnref.keyboard ?? generatorUnref.keyboard,
			answer: "" + questionUnref.answer,
			user: {
				result: false,
			},
		}
	}

	function list(n: number): generatedQuestionInterface[] {
		if (n < 1) {
			return []
		}

		const result: generatedQuestionInterface[] = []
		for (let i = 0; i < n; i++) {
			const value = randomQuestion()

			// Make sur the question is not already asked.
			if (result.some((q) => q.question === value.question)) {
				continue
			}

			result.push(randomQuestion())
		}
		return result
	}

	function randomQuestion(): generatedQuestionInterface {
		const g = unref(generator)
		const F = new Function("PiMath", g.code)

		try {
			const result = F(PiMath)
			if (!result.keyboard) {
				result.keyboard = g.keyboard
			}

			return result
		} catch (e) {
			throw new Error("Erreur dans la génération de la question")
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
		code: unref(generator).code ?? dftCode,
		question: (value?: generatedQuestionInterface) => question(value),
		list,
		random: () => randomQuestion(),
	}
}
