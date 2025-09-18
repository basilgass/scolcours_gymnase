<script
	setup
	lang="ts"
>
import {QuizzInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"

const props = defineProps<{
	quizz: QuizzInterface
}>()

const outro = computed(() => {
	const block = props.quizz.outro
	block.title = props.quizz.title

	return block
})
</script>

<template>
	<article class="grid place-items-center h-screen w-screen p-5">
		<div class="space-y-4 w-full max-w-2xl">
			<block-show
				class="min-h-[24rem]"
				:block="outro"
			/>
		</div>
	</article>
</template>
