<template>
	<article class="grid place-items-center mt-10">
		<div class="grid grid-cols-1 gap-4">
			<h1 class="text-xl">
				{{ props.quizz.title }}
			</h1>

			<markdown-it :text="props.quizz.body" />

			<icon-wait class="text-center mt-10" />
		</div>
	</article>
</template>

<script setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import IconWait from "@/Components/Ui/IconWait.vue"

let props = defineProps({
	quizz: {type: Object, required: true}
})
</script>
