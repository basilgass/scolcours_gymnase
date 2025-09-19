<script setup lang="ts">
import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"
import {QuizzInterface} from "@/types/modelInterfaces.ts"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {computed} from "vue"

const props = defineProps<{
	quizz: QuizzInterface
}>()

const intro = computed(() => {
	const block = props.quizz.intro
	block.title = props.quizz.title

	return block
})
</script>

<template>
	<article class="scolcours-container space-y-5">
		<block-show
			class="min-h-[24rem] w-full max-w-2xl mx-auto"
			:block="intro"
		/>

		<quizz-icon-wait class="text-center mt-20" />
	</article>
</template>
