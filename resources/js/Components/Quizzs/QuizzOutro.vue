<script
	setup
	lang="ts"
>
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps({
	quizz: {type: Object, required: true}
})
</script>

<template>
	<article class="grid place-items-center min-h-screen">
		<div>
			<div class="grid grid-cols-1 gap-4">
				<h1 class="text-lg md:text-xl lg:text-2xl">
					{{ props.quizz.title }}
				</h1>

				<markdown-it :text="props.quizz.outro" />
			</div>

			<sc-button
				href="/"
			>
				<i class="bi bi-house-door" /> Retour à l'accueil
			</sc-button>
		</div>
	</article>
</template>
