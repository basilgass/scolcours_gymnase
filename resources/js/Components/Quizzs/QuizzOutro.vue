<template>
	<article class="grid place-items-center min-h-screen">
		<div>
			<div class="grid grid-cols-1 gap-4">
				<h1 class="text-lg md:text-xl lg:text-2xl">
					{{ props.quizz.title }}
				</h1>

				<markdown-it :text="props.quizz.outro" />
			</div>

			<Link
				as="button"
				class="btn bg-white mt-10"
				href="/"
			>
				<i class="bi bi-house-door" /> Retour à l'accueil
			</Link>
		</div>
	</article>
</template>

<script setup>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"

let props = defineProps({
	quizz: {type: Object, required: true}
})
</script>
