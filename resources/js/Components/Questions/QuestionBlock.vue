<script lang="ts" setup>
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import { questionDataInterface } from "@/Components/Questions/QuestionShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { computed, inject } from "vue"

const questionData = inject<questionDataInterface>('questionData')

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const userAnswers = computed(()=>questionData.user.answers.value)

/**
 * Generate the body based on the answers
 * $a (in TeX mode)
 * $A (in markdown mode), inline or block
 * @$A (no format), block
 * The letter must be in alphabetic order!
 */
// TODO: Rework computed body based on answers : more efficient ?
const body = computed(() => {
	// Coherence control:
	// number of answers is the same as the number of variables
	if (!questionData.answersCoherences.value) {
		return questionData.question.value.block.body +
			"\n\n Il manque des réponses {.text-xs .text-center .text-red-500 .bg-red-100 .py-2 .font-code}"
	}

	// The body that will be manipulated
	let md = questionData.question.value.block.body

	for (let i = 0; i < questionData.answersVariables.value.length; i++) {
		// Get the current key
		const key = `\\$${alphabet[i]}`

		// Determiner the color to display...
		const texColor =
			i === questionData.answerId.value
				? "cornflowerblue"
				: "red"
		const rawColor =
			i === questionData.answerId.value
				? "border-blue-600"
				: "border-red-600"

		// Replace all lowercase keys by corresponding TeX value.
		let replaceValue = userAnswers.value[i].value.tex ? userAnswers.value[i].value.tex : "<\\ ? >"
		md = md.replaceAll(
			new RegExp(`${key.toLowerCase()}`, "gm"),
			`\\textcolor{${texColor}}{ ${replaceValue} }`)

		// Replace all uppercase, as block
		md = md.replaceAll(
			new RegExp(`\n(${key})`, "gm"),
			`\n${
				userAnswers.value[i].value.raw === "" ? "< ? >" : userAnswers.value[i].value.raw
			}\n{.border .px-3 .py-1 .${rawColor}}`)

		// Replace all uppercase, without default value
		md = md.replaceAll(
			new RegExp(`@(${key})`, "gm"),
			`\n<div class="border px-3 py-1 ${rawColor}">${
				userAnswers.value[i].value.raw
			}\n</div>`)

		// Replace all uppercase inline (there must be a space character before)
		replaceValue = userAnswers.value[i].value.raw ? userAnswers.value[i].value.raw : "<\\ ? >"
		md = md.replaceAll(
			new RegExp(`${key}`, "gm"),
			`[${
				userAnswers.value[i].value.raw === "" ? "< ? >" : userAnswers.value[i].value.raw
			}]{.border .px-3 .py-1 .${rawColor}}`)


	}
	return md
})

</script>

<template>
	<main class="flex-1 px-3 overflow-x-auto border-b pb-3">
		<!-- Illustration -->
		<illustration-show
			v-if="questionData.question.value.block.illustration"
			:illustration="questionData.question.value.block.illustration"
			class="bg-white"
		/>

		<!-- displayed text -->
		<markdown-it :text="body" />
	</main>
</template>

<style scoped>

</style>
