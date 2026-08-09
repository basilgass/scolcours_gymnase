/* useGenerators
 * Récupération, création de question à partir d'un générateur donné.
 */
import {generatedQuestionInterface, generatorResultInterface} from "@/types"
import type {GeneratorInterface, QuestionDynamicInterface} from "@/types/modelInterfaces"
import PiMath from "pimath"
import {ComputedRef, ref, unref} from "vue"
import {PiMathExt} from "@/PiMathExtended/PiMathExt.ts"
import {makeIllustration} from "@/helpers/makeModel.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import {resolveParameters} from "@/Composables/useGeneratorParameters.ts"

const ERROR_CAP = 0.75

export function answerIsWrong(answer: questionResultInterface, cap?: number): boolean {
	if (cap === undefined) cap = ERROR_CAP
	return (
		answer.validations.length > 0 &&
		answer.validations.some(v => v.score < cap)
	)
}

export type GeneratorParams = Record<string, string | number | boolean | number[]>

export function useGenerator(generator: GeneratorInterface | ComputedRef<GeneratorInterface>): generatorResultInterface {

	const level = ref<number>(1)

	function GeneratedToQuestion(value: generatedQuestionInterface): QuestionDynamicInterface {
		// Les données globales du générateur
		const generatorUnref = unref(generator)

		// La question générée
		const questionUnref = unref(value)

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
			user: {
				is_resolved: false
			},
			validation: questionUnref.validation ?? undefined
		}
	}

	function question(
		params?: GeneratorParams
	): QuestionDynamicInterface {
		return GeneratedToQuestion(randomQuestion(params))
	}

	function list(n: number, params?: GeneratorParams): QuestionDynamicInterface[] {
		if (n < 1) return []

		const result: generatedQuestionInterface[] = []

		for (let i = 0; i < n; i++) {
			// Create new random question
			const value = randomQuestion(params)

			// Make sure the question is not already asked.
			if (result.some((q) => q.question === value.question)) continue

			result.push(value)
		}

		return result.map(GeneratedToQuestion)
	}

	function randomQuestion(params?: GeneratorParams): generatedQuestionInterface {
		const g = unref(generator)

		const F = new Function("PiMath", "PiMathExt", "params", g.code)

		// on détermine	 les paramètres : soit il s'agit de la valeur donnée, soit c'est la valeur du générateur si elle existe.
		const resolved = resolveParameters(
			g.parameters_schema,
			params ? (params as Record<string, string> | undefined) : g.parameters
		)

		try {
			const result = F(PiMath, PiMathExt,
				Object.assign(
					{},
					{
						level: level.value
					},
					resolved
				))

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
		question: (params?: GeneratorParams) => question(params),
		list,
		random: (params?: GeneratorParams) => randomQuestion(params),
		level
	}
}
