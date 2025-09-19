<script
	setup
	lang="ts"
>
import {QuizzInterface, QuizzSessionInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"

const props = defineProps<{
	quizz: QuizzInterface,
	quizzSession?: QuizzSessionInterface
}>()

const outro = computed(() => {
	const block = props.quizz.outro
	block.title = props.quizz.title

	return block
})
</script>

<template>
	<article class="scolcours-container space-y-5">
		<block-show
			class="min-h-[24rem] w-full max-w-2xl mx-auto"
			:block="outro"
		/>

		<questions-index
			v-if="quizzSession && quizzSession.questions.length>0"
			:container="{
				id: quizz.id,
				type: 'Quizz'
			}"
			:questions="quizzSession.questions"
		/>
	</article>
</template>
