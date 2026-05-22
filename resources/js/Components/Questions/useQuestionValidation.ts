import {CheckerResult, makeCheckerResult, PiChecker} from "@/Checkers"
import {ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import {usePage} from "@inertiajs/vue3"
import {
	questionDataInterface,
	questionResultInterface,
	questionValidatorInterface
} from "@/Components/Questions/QuestionInterface.ts"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {computed, ref} from "vue"
import PiMath from "pimath"
import {PiMathExt} from "@/PiMathExtended/PiMathExt.ts"

const alphabet = "abcdefghijklmnopqrstuvwxyz"

// ─── Détection du type de validation ────────────────────────────────────────

type ValidationType = 'single' | 'multiple' | 'mixed'

function detectValidationType(answer: string): ValidationType {
	if (answer.startsWith('@')) return 'mixed'
	if (answer.includes('||')) return 'multiple'
	return 'single'
}

// ─── Stratégies de validation ────────────────────────────────────────────────

/**
 * Valide une réponse unique contre une valeur attendue fixe.
 */
function validateSingle(
	userAnswer: string,
	expectedAnswer: string,
	checker: PiChecker,
	override: Record<string, string>
): CheckerResult {
	try {
		const chk = checker.check(userAnswer, expectedAnswer)
		if (override[userAnswer]) {
			chk.message = override[userAnswer]
		}
		return chk
	} catch (e) {
		console.warn(e)
		return makeCheckerResult("Format de la réponse non reconnu.")
	}
}

/**
 * Valide une réponse contre plusieurs valeurs possibles séparées par ||.
 * Retourne le premier succès, ou le premier résultat si aucun ne correspond.
 */
function validateMultiple(
	userAnswer: string,
	allowedAnswers: string[],
	checker: PiChecker,
	override: Record<string, string>
): CheckerResult {
	let firstResult: CheckerResult | null = null

	for (const answer of allowedAnswers) {
		try {
			const chk = checker.check(userAnswer, answer)
			if (override[userAnswer]) {
				chk.message = override[userAnswer]
			}
			if (chk.result) {
				return chk
			}
			firstResult ??= chk
		} catch (e) {
			console.warn(e)
			firstResult ??= makeCheckerResult("Format de la réponse non reconnu.")
		}
	}

	return firstResult ?? makeCheckerResult("Réponse incorrecte.")
}

/**
 * Valide un groupe de réponses non ordonnées (préfixe @).
 * Chaque réponse utilisateur est comparée au pool des réponses attendues restantes.
 * Le pool se vide au fur et à mesure des correspondances.
 */
function validateMixed(
	validators: questionValidatorInterface[],
	userAnswers: string[],
	override: Record<string, string>
): CheckerResult[] {
	const pool: string[] = validators.map(v => v.answer.substring(1))
	const results: CheckerResult[] = []

	for (let i = 0; i < validators.length; i++) {
		const userAnswer = userAnswers[i]
		const checker: PiChecker = validators[i].checker.checker
		let matched = false

		for (let j = 0; j < pool.length; j++) {
			try {
				const chk = checker.check(userAnswer, pool[j])
				if (override[userAnswer]) {
					chk.message = override[userAnswer]
				}
				if (chk.result) {
					pool.splice(j, 1)
					results.push(chk)
					matched = true
					break
				}
			} catch (e) {
				console.warn(e)
			}
		}

		if (!matched) {
			results.push(makeCheckerResult("Réponse non trouvée parmi les réponses attendues."))
		}
	}

	return results
}

// ─── Composable principal ────────────────────────────────────────────────────

export function useQuestionValidation(questionData: questionDataInterface) {
	/**
	 * Sur une validation, il faut
	 * - bloquer le bouton pour ne pas exécuter plusieurs fois la validation
	 * - vérifier chaque réponse et créer l'objet validation
	 * - compiler les réponses globalement (once)
	 * - sauvegarder en DB si nécessaire
	 * - [animation pour signifier une erreur]
	 * - modifier le statut de la question.
	 */

	const errorMessages = ref<CheckerResult[]>([])
	const lock = ref(false)

	const questionResult = ref<questionResultInterface>({
		result: false,
		answer: "",
		tex: "",
		validations: []
	})

	const answersCount = computed(() => {
		return questionData.user.answers.value.filter(x => x.input.trim() !== '').length
	})

	const userAnswers = computed(() => {
		return questionData.user.answers.value.map((a) => a.input).join(",")
	})

	const userTexAnswers = computed(() => {
		return questionData.user.answers.value.map((a) => a.tex).join(",")
	})

	const buttonLabel = computed<string>(() => {
		if (questionData.config.silent) return "Réponse sauvegardée..."

		return questionResult.value.result ? "Bonne réponse !" : "Réponse incorrecte"
	})

	/**
	 * Résout toutes les validations en délégant à la stratégie appropriée
	 * selon le type de chaque réponse attendue.
	 */
	function resolveValidators(): CheckerResult[] {
		const validators = questionData.validators.value
		const override = questionData.current.checker.value.checkerOverride ?? {}
		const results: CheckerResult[] = new Array(validators.length)

		const mixedIndices: number[] = []

		validators.forEach((validator, index) => {
			const type = detectValidationType(validator.answer)

			if (type === 'mixed') {
				mixedIndices.push(index)
				return
			}

			const userAnswer = questionData.user.answers.value[index]?.input ?? ''

			if (type === 'multiple') {
				const allowedAnswers = validator.answer
					.split(/\|\|/)
					.map(a => a.trim())
					.filter(a => a !== '')
				results[index] = validateMultiple(userAnswer, allowedAnswers, validator.checker.checker, override)
			} else {
				results[index] = validateSingle(userAnswer, validator.answer, validator.checker.checker, override)
			}

			results[index].index = index + 1
		})

		if (mixedIndices.length > 0) {
			const mixedValidators = mixedIndices.map(i => validators[i])
			const mixedUserAnswers = mixedIndices.map(i => questionData.user.answers.value[i]?.input ?? '')
			const mixedResults = validateMixed(mixedValidators, mixedUserAnswers, override)
			mixedIndices.forEach((validatorIndex, i) => {
				results[validatorIndex] = mixedResults[i]
			})
		}

		return results
	}

	function reduce(validations: CheckerResult[]): boolean {
		return validations.every(validation => validation.result)
	}

	function validate() {
		lock.value = true

		// Valide toutes les variables selon leur type: multiple, mixed ou "simple"
		const validations = resolveValidators()

		// Vérifie que toutes les réponses sont corrects.
		let result = reduce(validations)

		// On doit vérifier la validation interne si result===false
		if (result === false && questionData.question.value.validation) {
			const code = questionData.question.value.validation
			try {
				const F = new Function("PiMath", "PiMathExt", "answers", code)
				const internalResult = F(PiMath, PiMathExt, questionData.user.answers.value, code)

				if (internalResult) {
					result = true
					validations.forEach(validation => {
						validation.result = true
						validation.score = 1
						validation.message = ""
					})
				}
			} catch (e) {
				console.warn('La validation a échoué.')
				console.error(e)
			}
		}

		errorMessages.value = questionData.config.silent
			? []
			: validations.filter(v => !v.result)

		save(validations)
			.then(() => {
				setTimeout(() => {
					lock.value = false
				}, 500)
			})
			.catch(() => {
				lock.value = false
			})

		questionResult.value = {
			result,
			answer: userAnswers.value,
			tex: userTexAnswers.value,
			validations
		}

		return result
	}

	async function save(validations: CheckerResult[]) {
		const score = questionData.user.score.value as ScoreInterface<ScoreQuestionDataInterface>

		if (
			!(questionData.question.value.id > 0)
			|| questionData.config.isDynamic
			|| !usePage().props.auth.user
			|| score.is_resolved
		) {
			return
		}

		score.score = validations
			.filter(v => v.result)
			.length / validations.length

		score.is_resolved =
			score.is_resolved ||
			score.score === 1

		const currentAnswers: string = questionData.user.answers.value.map(answer => answer.input).join('\n')
		const previousAnswers: string[] = score.data.answers.filter(x => x !== currentAnswers)

		if (previousAnswers[0] !== currentAnswers) {
			score.data.answers = [
				currentAnswers,
				...previousAnswers
			]

			if (score.data.answers.length > 10) {
				score.data.answers = score.data.answers.slice(0, 10)
			}
		}

		useStoreScore().updateScore(score)
			.then((res: ScoreInterface<ScoreQuestionDataInterface>) => {
				questionData.user.score.value = res
			})
	}

	return {
		lock,
		save,
		resolveValidators,
		reduce,
		validate,
		errors: errorMessages,
		answersCount,
		count: questionData.answers.values.value.length || 0,
		buttonLabel,
		result: questionResult
	}
}
