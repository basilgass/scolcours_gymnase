<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"

let props = defineProps({
	language: { type: String, required: true }
})
</script>
<template>
	<article>
		<ArticleTitle :title="language" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<Link
				:href="`/${language}/memory`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				memory
			</Link>
			<Link
				:href="`/${language}/guess`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				suggestions
			</Link>
			<Link
				:href="`/${language}/type`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				typographie
			</Link>
			<Link
				:href="`/${language}/list`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				liste des mots
			</Link>
		</div>
	</article>
</template>
