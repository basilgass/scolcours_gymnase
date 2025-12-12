<script lang="ts" setup>
/**
 * Affichage de la question avec l'incrustation de la question.
 */
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {computed, inject} from "vue"
import {keyboardEventInterface, questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"
import {onClick_answerIndex} from "@/Components/Questions/useQuestionHelpers.ts"
import {
	makeKey,
	replace_ABC_inline,
	replace_ABC_inline_no_div,
	replace_ABC_toBlock,
	replace_abc_toTex,
	replace_ABC_without_placeholder
} from "@/Components/Questions/computeQuestionBlock.ts"

const questionData = inject<questionDataInterface>('questionData')

/**
 * Generate the body based on the answers
 * $a (in TeX mode)
 * $A (in markdown mode), inline or block
 * @$A (no format), block
 * The letter must be in alphabetic order!
 */

const body = computed(() => {
	// Coherence control:
	// number of answers is the same as the number of variables
	if (!questionData.answers.coherences.value) {
		return questionData.block.value.body +
			"\n\n Il manque des réponses {.text-xs .text-center .text-red-500 .bg-red-100 .py-2 .font-code}"
	}

	// The body that will be manipulated
	let md = questionData.block.value.body

	for (let i = 0; i < questionData.answers.variables.value.length; i++) {
		const key = makeKey(i)
		console.log(key)
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
