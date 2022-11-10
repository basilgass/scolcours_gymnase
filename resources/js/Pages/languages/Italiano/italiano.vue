<template>
	<article>
		<ArticleTitle title="Italiano" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Link
				href="/italiano/memory"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				memory
			</Link>
			<Link
				href="/italiano/guess"
				class="bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				suggestions
			</Link>
			<Link
				href="/italiano/list"
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
