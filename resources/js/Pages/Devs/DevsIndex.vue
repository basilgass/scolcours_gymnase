<script
	setup
	lang="ts"
>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

defineProps<{
	pages: string[]
}>()

</script>
<template>
	<main class="scolcours-container">
		<!-- Title -->
		<ArticleTitle title="Développement" />

		<div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
			<InertiaLink
				v-for="(page, index) in pages"
				:key="index"
				:href="route('dev', [page])"
				class="hover:pl-4 transition-animation duration-300 p-3
				bg-content border"
			>
				{{ page }}
			</InertiaLink>
		</div>
	</main>
</template>
