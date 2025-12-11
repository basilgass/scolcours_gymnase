<script setup lang="ts">
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {inject} from "vue"
import {questionDataInterface} from "@/Components/Questions/QuestionInterface.ts"

withDefaults(defineProps<{
	showNumber?: boolean
}>(), {
	showNumber: true
})

const editMode = useStoreEditMode()

const questionData = inject<questionDataInterface>("questionData")

</script>

<template>
	<header class="flex flex-col relative w-full">
		<!-- QUESTION NUMBER -->
		<div
			v-if="questionData.question.value.order>0 && showNumber"
			v-theme.bg.text
			:class="{
				'draggable-handle cursor-move': editMode.enable,
			}"
			class="z-10 font-semibold font-code absolute left-1 -top-4 rounded-full border w-8 h-8 grid place-items-center draggable-handle"
		>
			{{ questionData.question.value.order }}
		</div>

		<div class="absolute top-0 right-0 text-right text-xs p-1">
			<i
				v-if="questionData.user.score.value"
				class="bi bi-check-circle text-green-600"
			/>
			<i
				v-else
				class="bi bi-ban text-red-600"
			/>
		</div>

		<!-- QUESTION TITLE -->
		<div
			v-katex.auto="questionData.question.value.block.title"
			class="px-3 py-3 font-semibold text-lg"
		/>
	</header>
</template>

<style scoped>

</style>
