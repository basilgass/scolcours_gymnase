<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })
defineProps({
	language: { type: String, required: true }
})
</script>
<template>
	<article class="scolcours-container">
		<ArticleTitle :title="language" />

		<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
			<InertiaLink
				:href="`/${language}/memory`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				memory
			</InertiaLink>
			<InertiaLink
				:href="`/${language}/guess`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				suggestions
			</InertiaLink>
			<InertiaLink
				:href="`/${language}/type`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				typographie
			</InertiaLink>
			<InertiaLink
				:href="`/${language}/list`"
				class="text-xl bg-white border rounded hover:scale-105 h-32 grid place-items-center transition-all duration-300"
			>
				liste des mots
			</InertiaLink>
		</div>
	</article>
</template>
