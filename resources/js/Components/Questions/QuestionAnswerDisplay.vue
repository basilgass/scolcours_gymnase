<script setup lang="ts">

import { inject, ref } from "vue"
import type { questionDataInterface } from "@/Pages/Questions/QuestionShow.vue"

const questionData = inject<questionDataInterface>('questionData')

const showAnswer = ref(false)

function toggle(){
	// Toggle the display
	showAnswer.value = !showAnswer.value

	// Emit the event with the change.
	emits('toggle', showAnswer.value)
}

const emits = defineEmits<{
	toggle: [value: boolean]
}>()
</script>

<template>
	<div
		v-if="questionData.question.user.result || $page.props.auth.can.admin"
		class="question-footer px-5 py-2"
	>
		<div>
			<button
				v-if="!showAnswer"
				class="text-xs text-gray-400 w-full"
				@click="toggle"
			>
				<i class="bi bi-eye mr-2" />voir la réponse
			</button>
			<div
				v-else
				class="cursor-pointer overflow-x-auto scrollbar-scolcours"
				@click="toggle"
			>
				<div
					class="text-xs text-center ml-3 font-code font-xs"
					v-text="questionData.question.answer"
				/>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
