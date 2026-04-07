<script lang="ts" setup>
/**
 * Affichage de la question avec l'incrustation de la question.
 */
import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import {inject} from "vue"
import {questionDataKey} from "@/Components/Questions/QuestionInterface.ts"
import {onClick_answerIndex} from "@/Components/Questions/useQuestionHelpers.ts"
import {useQuestionBlock} from "@/Components/Questions/computeQuestionBlock.ts"

const questionData = inject(questionDataKey)!

const {body, illustration} = useQuestionBlock(questionData)

// Gestionnaire de clics par délégation
function onAnswerClick(event: MouseEvent) {
	const index = onClick_answerIndex(event)

	if (index !== null) {
		questionData.current.id.value = index
	}
}

</script>

<template>
	<main
		:class="[
			'flex-1 px-3 overflow-x-auto pb-3 flex',
			questionData.question.value.css?.includes('i-bottom') ? 'flex-col-reverse' : 'flex-col'
		]"
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
