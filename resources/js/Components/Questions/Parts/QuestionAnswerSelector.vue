<script setup lang="ts">
import {computed, inject} from "vue"
import {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"

const questionData = inject<questionDataInterface>('questionData')

const totalAnswers = computed(() => {
	return questionData?.answers.values.value.length ?? 0
})
const currentId = computed({
	get: () => questionData?.current.id.value ?? 0,
	set: (v: number) => {
		if (questionData) questionData.current.id.value = v
	}
})

const isFirst = computed(() => currentId.value === 0)
const isLast = computed(() => currentId.value === totalAnswers.value - 1)
</script>

<template>
	<div
		v-if="totalAnswers>1"
		class="question-answer-selector flex justify-between items-center my-5"
	>
		<div class="w-[60px]">
			<transition name="btn-pop">
				<button
					v-if="!isFirst"
					v-theme.bg.text
					class="w-[60px] px-3 py-1 grid place-items-center text-xl rounded-full cursor-pointer"
					@click="currentId--"
				>
					<i class="bi-chevron-left" />
				</button>
			</transition>
		</div>
		<div
			class="text-center text-xs text-gray-400 flex-1"
			v-text="`Réponse ${currentId} / ${totalAnswers}`"
		/>
		<div class="w-[60px]">
			<transition name="btn-pop">
				<button
					v-if="!isLast"
					v-theme.bg.text
					class="w-[60px] px-3 py-1 grid place-items-center text-xl rounded-full cursor-pointer"
					@click="currentId++"
				>
					<i class="bi-chevron-right" />
				</button>
			</transition>
		</div>
	</div>
</template>


