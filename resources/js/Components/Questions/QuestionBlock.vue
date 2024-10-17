<script lang="ts" setup>
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import { questionDataInterface } from "@/Components/Questions/QuestionShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import { userAnswerInterface } from "@/types"
import { computed, inject, PropType, watch } from "vue"

const props = defineProps({
	userAnswers: { type: Object as PropType<userAnswerInterface[]>, required: true }
})

const questionData = inject<questionDataInterface>('questionData')

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

const answers = computed(() => {
	return questionData.question.answer.split("\n").filter((x) => x !== "")
})
/**
 * Generate the body based on the answers
 * $a (in TeX mode)
 * $A (in markdown mode), inline or block
 * @$A (no format), block
 * The letter must be in alphabetic order!
 */
const body = computed(() => {
	// Check if the number of answers matched the number of user answers
	if (props.userAnswers.length !== answers.value.length) {
		return questionData.question.block.body + "\n\n Il manque des réponses"
	}

	// The body that will be manipulated
	let md = questionData.question.block.body


	for (let i = 0; i < answers.value.length; i++) {
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
		let replaceValue = props.userAnswers[i].value.tex ? props.userAnswers[i].value.tex : "<\\ ? >"
		md = md.replaceAll(
			new RegExp(`${key.toLowerCase()}`, "gm"),
			`\\textcolor{${texColor}}{ ${replaceValue} }`)

		// Replace all uppercase, as block
		md = md.replaceAll(
			new RegExp(`\n(${key})`, "gm"),
			`\n${
				props.userAnswers[i].value.raw === "" ? "< ? >" : props.userAnswers[i].value.raw
			}\n{.border .px-3 .py-1 .${rawColor}}`)

		// Replace all uppercase, without default value
		md = md.replaceAll(
			new RegExp(`@(${key})`, "gm"),
			`\n<div class="border px-3 py-1 ${rawColor}">${
				props.userAnswers[i].value.raw
			}\n</div>`)

		// Replace all uppercase inline (there must be a space character before)
		replaceValue = props.userAnswers[i].value.raw ? props.userAnswers[i].value.raw : "<\\ ? >"
		md = md.replaceAll(
			new RegExp(`${key}`, "gm"),
			`[${
				props.userAnswers[i].value.raw === "" ? "< ? >" : props.userAnswers[i].value.raw
			}]{.border .px-3 .py-1 .${rawColor}}`)


	}
	return md
})

watch(body, () => {
		questionData.body.value = body.value
})
</script>

<template>
	<main class="flex-1 px-3 overflow-x-auto border-b pb-3">
		<!-- Illustration -->
		<illustration-show
			v-if="questionData.question.block.illustration"
			:illustration="questionData.question.block.illustration"
			class="bg-white"
		/>

		<!-- displayed text -->
		<markdown-it :text="body" />
	</main>
</template>

<style scoped>

</style>
