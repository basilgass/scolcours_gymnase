<script setup lang="ts">
import {QuestionInterface} from "@/types/modelInterfaces.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

withDefaults(defineProps<{
	question: QuestionInterface,
	showNumber?: boolean
}>(), {
	showNumber: true
})

const editMode = useStoreEditMode()

</script>

<template>
	<header class="flex flex-col relative">
		<!-- QUESTION NUMBER -->
		<div
			v-if="question.order>0 && showNumber"
			v-theme.bg.text
			:class="{
				'draggable-handle cursor-move': editMode.enable,
			}"
			class="z-10 font-semibold font-code absolute left-1 -top-4 rounded-full border w-8 h-8 grid place-items-center draggable-handle"
		>
			{{ question.order }}
		</div>

		<!-- QUESTION TITLE -->
		<div
			v-katex.auto="question.block.title"
			class="px-3 py-3 font-semibold text-lg"
		/>
	</header>
</template>

<style scoped>

</style>
