<script lang="ts" setup>
/**
 * Affichage de la question avec l'incrustation de la question.
 */
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {computed, inject} from "vue"
import {keyboardEventInterface, questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"
import {onClick_answerIndex} from "@/Components/Questions/useQuestionHelpers.ts"

const questionData = inject<questionDataInterface>('questionData')

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

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
	// TODO: answersCoherences n'est utilisé qu'ici !!!
	if (!questionData.answers.coherences.value) {
		return questionData.block.value.body +
			"\n\n Il manque des réponses {.text-xs .text-center .text-red-500 .bg-red-100 .py-2 .font-code}"
	}

	// The body that will be manipulated
	let md = questionData.block.value.body

	for (let i = 0; i < questionData.answers.variables.value.length; i++) {
		const key = makeKey(i)
		const answer: keyboardEventInterface = questionData.user.answers.value[i]

		// Determiner the color to display...
		const texColor =
			i === questionData.current.id.value
				? "cornflowerblue"
				: "red"
		const rawColor =
			i === questionData.current.id.value
				? "border-blue-600"
				: "border-red-600"
		const rawTextColor =
			i === questionData.current.id.value
				? "text-blue-600"
				: "text-red-600"

		// Replace all lowercase keys by corresponding TeX value.
		// $a, $b, $c, ....
		md = replace_abc_toTex(md, i, key, answer, texColor)

		// TODO: actualiser et vérifer toutes les options...
		// Replace all uppercase starting a line, as block
		// $A, $B, $C, ....
		md = replace_ABC_toBlock(md, i, key, answer, rawColor)

		// Replace all uppercase, without default value
		// @$A, @$B, @$C, ...
		md = replace_ABC_without_placeholder(md, i, key, answer, rawColor)

		// Replace all uppercase inline (there must be a space character before)
		// WITHOUT SURROUNDING DIV !
		// _$A, _$B, _$C
		md = replace_ABC_inline_no_div(md, i, key, answer, rawTextColor)

		// Replace all uppercase inline (there must be a space character before)
		// $A, $B, $C
		md = replace_ABC_inline(md, i, key, answer, rawColor)
	}
	return md
})

const illustration = computed(() => {
	let code = questionData.block.value.illustration.code
	for (let i = 0; i < questionData.answers.variables.value.length; i++) {
		const key = makeKey(i)
		const answer: keyboardEventInterface = questionData.user.answers.value[i]

		const texColor =
			i === questionData.current.id.value
				? "cornflowerblue"
				: "red"

		// Replace all lowercase keys by corresponding TeX value.
		code = replace_abc_toTex(code, i, key, answer, texColor)
	}

	return {
		...questionData.block.value.illustration,
		code
	}
})

function makeKey(i: number): string {
	return `\\$${alphabet[i]}`
}

function replace_abc_toTex(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $a, $b, ...
	// console.log(md)
	// console.log(key)
	// console.log(answer)
	// console.log(color)
	// const r = new RegExp(`${key.toLowerCase()}`, "gm")
	// console.log(r)
	//
	// console.log('MATCH', md.match(r))
	return md.replaceAll(
		new RegExp(`${key.toLowerCase()}`, "gm"),
		`\\htmlData{answer-index=${index}}{\\textcolor{${color}}{${
			answer.tex ?
				answer.tex :
				"<\\;?>"
		}}}`)
}

function replace_ABC_toBlock(md: string, index: number, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ...
	return md.replaceAll(
		new RegExp(`\n${key}`, "gm"),
		`\n<div data-answer-index="${index}" class="border p-3 ${color}">\n\n${
			answer.raw ?
				answer.raw :
				"< ? >"

		}\n\n</div>`)
}

function replace_ABC_inline(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`${key}`, "gm"),
		`<div data-answer-index="${index}" class="border px-3 py-1 inline-block ${color}">${
			answer.raw ?
				answer.raw :
				"< ? >"
		}</div>`)
}

function replace_ABC_inline_no_div(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// $A, $B, ... inline
	return md.replaceAll(
		new RegExp(`_${key}`, "gm"),
		answer.raw ?
			answer.raw :
			`<span data-answer-index="${index}" class="px-3 ${color}">< ? ></span>`
	)
}

function replace_ABC_without_placeholder(md: string, index, key: string, answer: keyboardEventInterface, color: string): string {
	// @$A, @$B, ...
	return md.replaceAll(
		new RegExp(`@(${key})`, "gm"),
		`\n<div data-answer-index="${index}" class="border px-3 py-1 ${color}">${
			answer.raw
		}\n</div>`)
}

// Gestionnaire de clics par délégation
function onAnswerClick(event: MouseEvent) {
	const index = onClick_answerIndex(event)

	// Mise à jour de la sélection courante.
	if (questionData && index !== null) {
		questionData.current.id.value = index
	}
}
</script>

<template>
	<main
		class="flex-1 px-3 overflow-x-auto pb-3"
		@click="onAnswerClick"
	>
		<!-- Illustration -->
		<illustration-show
			v-if="questionData.block.value.illustration"
			:illustration
			class="bg-white"
		/>

		<!-- displayed text -->
		<markdown-it
			:text="body"
		/>
	</main>
</template>

<style scoped>
::v-deep([data-answer-index]) {
	cursor: pointer
}
</style>
