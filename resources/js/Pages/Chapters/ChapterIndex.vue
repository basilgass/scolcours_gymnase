<script lang="ts" setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import { PropType } from "vue"
import { router, usePage } from "@inertiajs/vue3"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import theme from "tailwindcss/defaultTheme"
import type { ChapterInterface } from "@/types/modelInterfaces"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import ChapiterIndexCreateAdmin from "@/Pages/Chapters/ChapiterIndexCreateAdmin.vue"

defineOptions({ layout: LayoutMain })

defineProps({
	chapters: {
		type: Object as PropType<ChapterInterface[]>,
		default: () => {
		}
	}
})

function triggerEnter(items: ChapterInterface[]){
	// si il n'y a qu'un élément afficher, on le charge.
	if(items.length===1){
		router.visit(route('chapters.show', [items[0].slug]))
		return
	}
}
</script>

<template>
	<section class="scolcours-container">
		<div class="flex justify-between items-center">
			<ArticleTitle :title="theme.title" />
		</div>


		<filtered-list
			:list="chapters"
			list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
			title="chapitres"
			@enter="triggerEnter"
		>
			<template #button>
				<ChapiterIndexCreateAdmin />
			</template>
			<template #card="{ item }:{ item: Object}">
				<Link
					:class="{
						'opacity-30 hover:opacity-70': +item['active'] === 0,

					}"
					class="bg-white block h-full text-xl rounded px-5 py-3 shadow cursor-pointer transition-all"
					:href="route('themes.chapters.intro',[usePage().props.theme.slug, item['slug']])"
				>
					<h3 v-katex.auto="item['title']" />

					<markdown-it :text="item['block']['body']" />
				</Link>
			</template>
		</filtered-list>
	</section>
</template>

