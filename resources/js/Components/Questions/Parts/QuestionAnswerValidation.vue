<script lang="ts" setup>

/**
 * Sur une validation, il faut
 * - bloquer le bouton pour ne pas exécuter plusieurs fois la validation
 * - vérifier chaque réponse et créer l'objet validation
 * - compiler les réponses globalement (once)
 * - sauvegarder en DB si nécessaire
 * - [animation pour signifier une erreur]
 * - modifier le statut de la question.
 */


import {useWrongAnswerAnimation} from "@/Composables/useHelpers.ts"
import {usePage} from "@inertiajs/vue3"
import {computed, inject, ref, useTemplateRef} from "vue"
import {
	questionDataInterface,
	questionResultInterface,
	questionValidatorInterface
} from "@/Components/Questions/QuestionInterface.ts"
import type {CheckerResult, PiChecker} from "@/Checkers"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"
import {ScoreInterface} from "@/types/modelInterfaces.ts"

interface CheckerResultWithIndex extends CheckerResult {
	index: number
}

const emits = defineEmits<{
	validate: [event: questionResultInterface]
}>()

const questionData = inject<questionDataInterface>("questionData")

const lockValidationButton = ref(false)
const lockValidationButtonLabel = computed<string>(() => {
	if (questionData.config.silent) return "Réponse sauvegardée..."

	return questionResult.value.result ? "Bonne réponse !" : "Réponse incorrecte"
})
const validateButton = useTemplateRef<InstanceType<typeof ScButton>>('validateButton')

const userAnswers = computed(() => {
	return questionData.user.answers.value.map((a) => a.input).join(",")
})

const UserTexAnswers = computed(() => {
	return questionData.user.answers.value.map((a) => a.tex).join(",")
})

const userAnswersCount = computed(() => {
	return questionData.user.answers.value.filter(x => x.input.trim() !== '').length
})


const errorMessages = ref<string[]>([])

const questionResult = ref<questionResultInterface>({
	result: false,
	answer: "",
	tex: ""
})

const scoreStore = useStoreScore()

// const score = questionData.user.score as Ref<ScoreInterface<ScoreQuestionDataInterface>>

function getAnswerValidation(validator: questionValidatorInterface, index: number, mixedAnswer: string[]): CheckerResultWithIndex {
	// La réponse de l'utilisateur
	const userAnswer: string = questionData.user.answers.value[index].input
	if (userAnswer === undefined) {
		return {
			result: false,
			message: "Vous n'avez pas répondu à la question",
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
				result: false,
				message: "Format de la réponse non reconnu.",
				index
			})
		}
	})

	return results.find(r => r.result) || results[0]
}

function updateAnswersValidation(): CheckerResultWithIndex[] {
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
		const result = getAnswerValidation(validator, index, mixedAnswers)

		validation.push(result)
	})

	return validation
}

function reduceAnswersValidation(validations: CheckerResultWithIndex[]): boolean {
	return validations.every(validation => validation.result)
}

async function saveToDB(validations: CheckerResult[]) {

	const score = questionData.user.score.value as ScoreInterface<ScoreQuestionDataInterface>
	if (
		!(questionData.question.id > 0)
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


	scoreStore.updateScore(score)
		.then((res: ScoreInterface<ScoreQuestionDataInterface>) => {
			// update the score
			questionData.user.score.value = res
		})
}

function emitToParent(result: boolean): questionResultInterface {
	const emitValue: questionResultInterface = {
		result,
		answer: userAnswers.value,
		tex: UserTexAnswers.value
	}

	emits('validate', emitValue)

	return emitValue
}

function validateQuestion() {
	// Disable the button
	lockValidationButton.value = true

	// Liste brute des réponses et succès
	const validations = updateAnswersValidation()

	// Défini le résultat final
	const result = reduceAnswersValidation(validations)

	// émettre au parent les modifications et mise à jour du résultat de la question
	questionResult.value = emitToParent(result)

	// La réponse est fausse -> effet visuel
	if (
		!result &&
		questionData.config.animation &&
		!questionData.config.silent
	) {
		useWrongAnswerAnimation(validateButton.value.$el)
	}

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
	saveToDB(validations)
		.then(() => {
			setTimeout(() => {
				lockValidationButton.value = false
			}, 500)
		})
}

</script>

<template>
	<div class="question-validation-wrapper">
		<div class="max-w-xl mx-auto keyboard mb-5">
			<sc-button
				ref="validateButton"
				:class="{
					'cursor-not-allowed': lockValidationButton,
				}"
				:disabled=" lockValidationButton || userAnswersCount===0"
				class="key-cmd w-full"
				theme
				@click="validateQuestion"
			>
				<p v-if="lockValidationButton">
					{{ lockValidationButtonLabel }}
				</p>
				<p
					v-else-if="userAnswersCount===0"
					class="font-extralight"
				>
					Entrer une réponse...
				</p>
				<p v-else-if="userAnswersCount<questionData.answers.values.value.length">
					{{ userAnswersCount }} réponse(s) sur {{ questionData.answers.values.value.length }}
				</p>
				<p v-else>
					<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
				</p>
			</sc-button>
		</div>

		<!-- Error messages -->
		<div
			v-if="errorMessages.length > 0"
			class="max-w-xl mx-auto
			 p-3  my-2
			border rounded
			text-red-600 dark:text-red-100
			bg-red-100 dark:bg-red-900
			border-red-600 dark:border-red-700"
		>
			<div
				v-for="(msg, index) in errorMessages"
				:key="`error-${index}`"
				v-katex.auto="msg"
				class="text-xs"
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
