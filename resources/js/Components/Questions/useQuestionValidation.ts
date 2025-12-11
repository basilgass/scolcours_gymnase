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
import {computed, ref, useTemplateRef} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

interface CheckerResultWithIndex extends CheckerResult {
	index: number
}

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

	
	const errorMessages = ref<string[]>([])
	const lock = ref(false)

	const questionResult = ref<questionResultInterface>({
		result: false,
		answer: "",
		tex: ""
	})
	const answersCount = computed(() => {
		return questionData.user.answers.value.filter(x => x.input.trim() !== '').length
	})
	const userAnswers = computed(() => {
		return questionData.user.answers.value.map((a) => a.input).join(",")
	})
	const UserTexAnswers = computed(() => {
		return questionData.user.answers.value.map((a) => a.tex).join(",")
	})

	const button = useTemplateRef<InstanceType<typeof ScButton>>('validateButton')
	const buttonLabel = computed<string>(() => {
		if (questionData.config.silent) return "Réponse sauvegardée..."

		return questionResult.value.result ? "Bonne réponse !" : "Réponse incorrecte"
	})

	function validateAnswer(validator: questionValidatorInterface, index: number, mixedAnswer: string[]): CheckerResultWithIndex {
		// La réponse de l'utilisateur
		const userAnswer: string = questionData.user.answers.value[index].input
		if (userAnswer === undefined) {
			return {
				...makeCheckerResult("Vous n'avez pas répondu à la question"),
				index
			}
		}


		// Les résultats pour le check en cours.
		const results: CheckerResultWithIndex[] = []

		/** answer peut-être
		 * 		<réponse>
		 * 		<réponse>||<réponse>  (plusieurs réponses possibles - réponses non alignées)
		 * 		@<réponse> autorise de donner les réponses qui commencent par @ dans n'importe quel ordre.
		 */

		const isMixedAnswer = mixedAnswer.length > 0 && validator.answer.startsWith('@')

		// Toutes les réponses autorisées.
		// Si c'est un mixed answer
		const allowedAnswers: string[] = isMixedAnswer
			? mixedAnswer
			: validator.answer
				.split(/\|\|/)
				.map(a => a.trim())
				.filter(a => a !== '')

		// Le système de checker
		const checker: PiChecker = validator.checker.checker

		// On vérifie si la réponse de l'utilisateur est dans les réponses autorisées
		allowedAnswers.forEach((answer, idx) => {

			// On est dans un cas où il y a plusieurs réponses possibles
			try {
				const chk = checker.check(userAnswer, answer)

				if (questionData.current.checker.value.checkerOverride[userAnswer]) {
					chk.message = questionData.current.checker.value.checkerOverride[userAnswer]
				}

				results.push({
					...chk,
					index
				})

				if (chk.result) {
					// On a trouvé une réponse.

					// Si on est dans une réponse non ordonnée, on l'enlève de la liste disponible.
					if (isMixedAnswer) {
						mixedAnswer.splice(idx, 1)
					}

					// Pas besoin de continuer.
					return
				}
			} catch (e) {
				console.warn(e)
				results.push({
					...makeCheckerResult("Format de la réponse non reconnu."),
					index
				})
			}
		})

		return results.find(r => r.result) || results[0]
	}

	function update(): CheckerResultWithIndex[] {
		// Make the validation.
		// validation = {result: Boolean, message: string, index: number}
		let validation: CheckerResultWithIndex[] = []

		/** Il faut comparer
		 * - questionData.answers: string[]
		 * - questionData.user.answers: string[]
		 */

		const mixedAnswers = questionData.validators.value
			.filter(validator => validator.answer.startsWith('@'))
			.map(validator => validator.answer.substring(1))

		questionData.validators.value.forEach((validator, index) => {
			const result = validateAnswer(validator, index, mixedAnswers)

			validation.push(result)
		})

		return validation
	}

	function reduce(validations: CheckerResultWithIndex[]): boolean {
		return validations.every(validation => validation.result)
	}

	function validate() {
		// Disable the button
		lock.value = true

		// Liste brute des réponses et succès
		const validations = update()

		// Défini le résultat final
		const result = reduce(validations)

		// Afficher les messages d'erreurs
		errorMessages.value = questionData.config.silent
			? []
			: validations
				.map((v, index) => {
					if (questionData.answers.variables.value.length === 1) {
						return v.result ? "" : `${v.message}`
					} else {
						return v.result ? "" : `${index + 1}. ${v.message}`
					}
				})
				.filter(msg => msg !== "")

		// Sauvegarde dans la base de donnée
		save(validations)
			.then(() => {
				setTimeout(() => {
					lock.value = false
				}, 500)
			})


		questionResult.value = {
			result,
			answer: userAnswers.value,
			tex: UserTexAnswers.value
		}

		return result
	}

	async function save(validations: CheckerResult[]) {

		const score = questionData.user.score.value as ScoreInterface<ScoreQuestionDataInterface>
		if (
			!(questionData.question.value.id > 0)
			|| questionData.config.isDynamic  // It's a dynamic question
			|| !usePage().props.auth.user	// user is not connected
			|| score.is_resolved // question is already resolved.
		) {
			return
		}

		// score value
		score.score = validations
			.filter(v => v.result)
			.length / validations.length

		// score resolved.
		score.is_resolved =
			score.is_resolved ||
			score.score === 1

		// data = list of answers and previous answers.
		// only update if it's a new answer, not already in the list.
		const currentAnswers: string = questionData.user.answers.value.map(answer => answer.input).join('\n')
		const previousAnswers: string[] = score.data.answers.filter(x => x !== currentAnswers)

		if (previousAnswers[0] !== currentAnswers) {
			score.data.answers = [
				currentAnswers,
				...previousAnswers
			]

			// On ne garde qu'au maximum dix valeurs.
			if (score.data.answers.length > 10) {
				score.data.answers = score.data.answers.slice(0, 10)
			}
		}

		useStoreScore().updateScore(score)
			.then((res: ScoreInterface<ScoreQuestionDataInterface>) => {
				// update the score
				questionData.user.score.value = res
			})
	}


	return {
		lock,
		save,
		update,
		reduce,
		validate,
		errors: errorMessages,
		answersCount,
		count: questionData.answers.values.value.length,
		button,
		buttonLabel,
		result: questionResult
	}
}
