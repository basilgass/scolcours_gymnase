<script setup lang="ts">

import {inject} from "vue"
import {questionDataInterface, questionUserInputDisplayType} from "@/Components/Questions/QuestionInterface.ts"

const questionData = inject<questionDataInterface>('questionData')

function toggleKeyboard(value: questionUserInputDisplayType) {
	questionData.config.showInput.value = value
}
</script>

<template>
	<div
		class="text-right text-sm py-3 px-3"
	>
		<button
			v-if="questionData.config.showInput.value==='hide'"
			v-theme.bg.text
			class="flex gap-2 justify-center items-center mx-auto px-2 py-2 rounded-xl shadow hover:shadow-none w-full"
			@click="toggleKeyboard('show')"
		>
			<i class="text-xl bi bi-calculator" /><span class="hidden md:inline-block"> donner la réponse</span>
		</button>
		<button
			v-else
			class="px-5 group text-red-600"
			@click="toggleKeyboard('hide')"
		>
			fermer
			<i
				class="bi bi-x-lg inline-block ml-2 group-hover:rotate-180 transition-all transform duration-500 ease-in-out"
			/>
		</button>
	</div>
</template>

<style scoped>

</style>
