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
import {questionDataInterface, questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"
import type {CheckerResult, PiChecker} from "@/Checkers"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {ScoreQuestionDataInterface} from "@/types/scoreInterfaces.ts"

const emits = defineEmits<{
	validate: [event: questionResultInterface]
}>()

const questionData = inject<questionDataInterface>("questionData")

const lockValidationButton = ref(false)

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
const score = await scoreStore.getScore('Question', questionData.question.id)

function updateAnswersValidation(): CheckerResult[] {
	// Make the validation.
	// validation = {result: Boolean, message: string, index: number}
	let validation: CheckerResult[] = []

	/** Il faut comparer
	 * - questionData.answers: string[]
	 * - questionData.user.answers: string[]
	 *
	 */

	questionData.validators.value.forEach((validator, index) => {
		/** answer peut-être
		 * 		<réponse>
		 * 		<réponse>||<réponse>  (plusieurs réponses possibles)
		 * 		@mix:<réponse>\n@mix:<réponse> (les réponses ne sont pas ordrées)
		 */

			// Toutes les réponses autorisées.
		const allowedAnswers: string[] = validator.answer.split('||').map(a => a.trim())

		// La réponse de l'utilisateur
		const userAnswer: string = questionData.user.answers.value[index].input

		// Le système de checker
		const checker: PiChecker = validator.checker.checker

		// On vérifie si la réponse de l'utilisateur est dans les réponses autorisées
		const results: CheckerResult[] = []
		allowedAnswers.forEach((answer, index) => {
			try {
				if (userAnswer === undefined) {
					results.push({
						result: false,
						message: "Vous n'avez pas répondu à la question",
						index
					})
				} else {
					const chk = checker.check(userAnswer, answer)

					if (questionData.current.checker.value.checkerOverride[userAnswer]) {
						chk.message = questionData.current.checker.value.checkerOverride[userAnswer]
					}
					results.push(chk)
				}

			} catch (err) {
				console.log(err)
				results.push({
					result: false,
					message: "Format de la réponse non reconnu.",
					index
				})
			}
		})

		// On prend soit le résultat correct, soit le premier résultat faux
		validation.push(results.find(r => r.result) || results[0])
	})

	return validation
}

function reduceAnswersValidation(validations: CheckerResult[]): boolean {
	return validations.every(validation => validation.result)
}

async function saveToDB(validations: CheckerResult[]) {
	if (
		!(questionData.question.id > 0) || questionData.config.isDynamic || // It's a dynamic question
		!usePage().props.auth.user ||	// user is not connected
		score.is_resolved // question is already resolved.
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
	const previousAnswers: string[] = (score.data as ScoreQuestionDataInterface)?.answers ?? []
	const currentAnswers: string = questionData.user.answers.value.map(answer => answer.input).join('\n')
	if (!previousAnswers.includes(currentAnswers)) {
		score.data = {
			'answers': [
				currentAnswers,
				...previousAnswers
			]
		}
	}


	scoreStore.updateScore(score)
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
	if (!result && questionData.config.animation) {
		useWrongAnswerAnimation(validateButton.value.$el)
	}

	// Afficher les messages d'erreurs
	errorMessages.value = validations.map((v, index) => {
		return v.result ? "" : `${index + 1}. ${v.message}`
	}).filter(msg => msg !== "")

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
				theme
				:class="{
					'cursor-not-allowed': lockValidationButton,
				}"
				:disabled=" lockValidationButton || userAnswersCount===0"
				class="key-cmd w-full"
				@click="validateQuestion"
			>
				<p v-if="lockValidationButton">
					{{ questionResult.result ? "Bonne réponse !" : "Réponse incorrecte" }}
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
