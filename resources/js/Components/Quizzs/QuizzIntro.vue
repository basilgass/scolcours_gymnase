<script setup lang="ts">
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import QuizzIconWait from "@/Components/Quizzs/QuizzIconWait.vue"

const props = defineProps({
	quizz: {type: Object, required: true}
})
</script>

<template>
	<article class="grid place-items-center mt-10">
		<div class="grid grid-cols-1 gap-4">
			<h1 class="text-xl lg:text-2xl font-semibold">
				{{ props.quizz.title }}
			</h1>

			<markdown-it :text="props.quizz.body" />

			<quizz-icon-wait class="text-center mt-20" />
		</div>
	</article>
</template>
