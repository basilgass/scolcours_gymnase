<script lang="ts" setup>

import { ChallengeAnswerInterface } from "@/Components/Challenges/ChallengeGame.vue"
import { questionDataInterface } from "@/Components/Questions/QuestionShow.vue"
import { useWrongAnswerAnimation } from "@/Composables/useHelpers"
import { userAnswerInterface } from "@/types"
import { usePage } from "@inertiajs/vue3"
import axios from "axios"
import { inject, ref } from "vue"

const emits = defineEmits<{
	validate: [event: ChallengeAnswerInterface]
}>()

const questionData = inject<questionDataInterface>("questionData")
const lockValidationButton = ref(false)

const validateButton = ref(null)

function validateQuestion() {
	// Disable the button
	lockValidationButton.value = true

	// Reset the error messags.
	questionData.user.errors.value = []

	// Go through each answers and validate each of them.
	const result = checkResult()

	// Answer is wrong - show a little animation
	if (!result && questionData.config.animation) useWrongAnswerAnimation(validateButton.value)

	// Prepare the emit value
	// TODO: emitValue from QuestionValidation should not be "ChallengeAnswerInterface"
	const emitValue: ChallengeAnswerInterface = {
		question: questionData.body.value,
		result: result,
		attempts: 0,    // TODO: added attempts here - must check if it's really used !
		answer: questionData.user.answers.value.map((a) => a.value.input).join(",")
	}

	// Save to database if the question
	// - is NOT dynamic
	// - and the user is connected.
	if (!questionData.config.dynamic && usePage().props.auth.user && emitValue.answer!=='') {

		// It's a question in the database - store the value.
		axios
			.post(route("questions.validate", [questionData.question.value.id]), {
				...emitValue
			})
			.catch((res) => {
				console.warn("Il y a une erreur lors du chargement de la réponse.")
				console.warn(res.response.data.message)
			})
			.then(() => {
				emits("validate", emitValue)
			})
			.finally(() => {
				setTimeout(()=>lockValidationButton.value = false, 500)
			})
	} else {
		setTimeout(()=> {
			emits("validate", emitValue)
			lockValidationButton.value = false
		}, 500)
	}
}

function checkResult(): boolean {
	// answer result
	let result = true

	// index is the current answer alternative
	let index

	questionData.user.answers.value.forEach((answer: userAnswerInterface, id: number) => {

		// Store the current (possibly alternated) answer
		if (index === undefined) index = answer.validation.index

		// Get the current result
		result =
			result && // currently correct answer
			answer.validation.result && // the actual answer must be correct
			index === answer.validation.index // if there are alternate answer, they must be the same.

		// Stack the error if there is one.
		if (!answer.validation.result) {
			// The error message can be the given one.
			// if the message is empty, either there is no helper message, either the answer was not given.
			let msg = answer.validation.message
			if (msg === "") {
				msg = questionData.user.answers.value[id].value.input === ""
					? "Vous n'avez pas répondu à cette question."
					: "La réponse est incorrecte."
			}

			questionData.user.errors.value.push(
				`${questionData.answers.value.length > 1 ? `${id + 1}: ` : ""}${msg}`
			)
		}
	})

	return result
}
</script>

<template>
	<div class="question-validation-wrapper">
		<div class="max-w-xl mx-auto keyboard mb-5">
			<button
				ref="validateButton"
				v-theme.btn
				:class="lockValidationButton?'cursor-not-allowed':''"
				:disabled="lockValidationButton"
				class="key-cmd w-full"
				@click="validateQuestion"
			>
				<p v-if="!lockValidationButton">
					<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
				</p>
				<p v-else>
					Envoi de la réponse...
				</p>
			</button>
		</div>

		<!-- Error messages -->
		<div
			v-if="questionData.user.errors.value.length > 0"
			class="max-w-xl mx-auto border bg-red-50 border-red-600 p-3 rounded-sm my-2"
		>
			<div
				v-for="(msg, index) in questionData.user.errors.value"
				:key="`error-${index}`"
				v-katex.auto="msg"
				class="text-red-600 text-xs"
			/>
		</div>
	</div>
</template>


