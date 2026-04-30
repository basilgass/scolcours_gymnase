/* useGenerators
 * Récupération, création de question à partir d'un générateur donné.
 */
import {generatedQuestionInterface, generatorResultInterface} from "@/types"
import type {GeneratorInterface, QuestionDynamicInterface} from "@/types/modelInterfaces"
import PiMath from "pimath"
import {ComputedRef, ref, Ref, unref} from "vue"
import {PiMathExt} from "@/PiMathExtended/PiMathExt.ts"
import {makeIllustration} from "@/helpers/makeModel.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"

const ERROR_CAP = 0.75

export function answerIsWrong(answer: questionResultInterface, cap?: number): boolean {
	if (cap === undefined) cap = ERROR_CAP
	return (
		answer.validations.length > 0 &&
		answer.validations.some(v => v.score < cap)
	)
}

export function useGenerator(generator: GeneratorInterface | ComputedRef<GeneratorInterface>): generatorResultInterface {

	const level = ref<number>(1)

	function question(
		value?: Ref<generatedQuestionInterface> | generatedQuestionInterface
	): QuestionDynamicInterface {
		if (value === undefined) value = randomQuestion()

		const questionUnref = unref(value)
		const generatorUnref = unref(generator)

		return {
			block: {
				id: 0,
				title: questionUnref.title ?? "",
				body: generatorUnref.template
					.replace("question", questionUnref.question)
					.replace("answer", "$a"),
				illustration: questionUnref.illustration ? makeIllustration(questionUnref.illustration) : null
			},
			keyboard: questionUnref.keyboard ?? generatorUnref.keyboard,
			answer: "" + questionUnref.answer,
			equationControl: null,
			user: {
				is_resolved: false
			}
		}
	}

	function list(n: number): QuestionDynamicInterface[] {
		if (n < 1) {
			return []
		}

		const result: generatedQuestionInterface[] = []
		for (let i = 0; i < n; i++) {
			const value = randomQuestion()

			// Make sur the question is not already asked.
			if (result.some((q) => q.question === value.question)) continue

			result.push(randomQuestion())
		}
		return result.map(rnd => question(rnd))
	}

	function randomQuestion(): generatedQuestionInterface {
		const g = unref(generator)

		const F = new Function("PiMath", "PiMathExt", "params", g.code)

		try {
			const result = F(PiMath, PiMathExt, {
				level: level.value
			})

			if (!result.keyboard) {
				result.keyboard = g.keyboard
			}

			return result
		} catch (e) {
			console.warn(e)
			throw new Error("Erreur dans la génération de la question (voir la console pour plus détails)")
		}
	}

	const dftCode = `return {
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
		level
	}
}
