<script setup lang="ts">

import {inject} from "vue"
import {questionDataInterface, questionUserInputDisplayType} from "@/Components/Questions/QuestionInterface.ts"
import ScButton from "@/Components/Ui/scButton.vue"

const questionData = inject<questionDataInterface>('questionData')

function toggleKeyboard(value: questionUserInputDisplayType) {
	questionData.config.showInput.value = value
}
</script>

<template>
	<div
		class="text-right text-sm py-3 px-3"
	>
		<sc-button
			v-if="questionData.config.showInput.value==='hide'"
			class="flex gap-2 justify-center items-center mx-auto px-2 py-2 rounded-xl shadow hover:shadow-none w-full"
			@click="toggleKeyboard('show')"
			theme
		>
			<i class="text-xl bi bi-calculator" /><span class="hidden md:inline-block"> donner la réponse</span>
		</sc-button>
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
