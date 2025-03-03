<script setup lang="ts">
import { inject } from "vue"
import {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"

const questionData = inject<questionDataInterface>('questionData')

</script>

<template>
	<div
		v-if="questionData.answers.value.length>1"
		class="question-answer-selector flex justify-between items-center my-5"
	>
		<button
			v-theme.bg.hover
			:class="questionData.answerId.value === 0 ? 'invisible' : ``"
			class="px-3 text-xl text-white font-semibold border rounded-full"
			@click="questionData.answerId.value--"
		>
			<i class="bi-chevron-left" />
		</button>
		<div
			class="text-center text-xs text-gray-400"
			v-text="`Réponse ${questionData.answerId.value + 1} / ${questionData.answers.value.length}`"
		/>
		<button
			v-theme.bg.hover
			:class="questionData.answerId.value === questionData.answers.value.length - 1 ? 'invisible' : ``"
			class="px-3 text-xl text-white font-semibold border rounded-full"
			@click="questionData.answerId.value++"
		>
			<i class="bi-chevron-right" />
		</button>
	</div>
</template>


