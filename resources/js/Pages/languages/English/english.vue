<template>
	<article>
		<ArticleTitle title="English" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Link
				href="/english/memory"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				memory
			</Link>
			<Link
				href="/english/guess"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				suggestions
			</Link>
			<Link
				href="/english/list"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				liste des mots
			</Link>
		</div>
	</article>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
</script>
