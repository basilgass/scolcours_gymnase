<script
	lang="ts"
	setup
>
import FilteredList from "@/Components/Ui/FilteredList.vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import ChapiterIndexCreateAdmin from "@/Pages/Chapters/ChapiterIndexCreateAdmin.vue"
import type { ChapterInterface } from "@/types/modelInterfaces"
import { router, usePage } from "@inertiajs/vue3"
import { PropType } from "vue"

defineOptions({ layout: LayoutMain })

defineProps({
	chapters: {
		type: Object as PropType<ChapterInterface[]>,
		default: () => { }
	}
})

function triggerEnter(items: ChapterInterface[]) {
	// si il n'y a qu'un élément afficher, on le charge.
	if (items.length === 1) {
		router.visit(route('chapters.show', [items[0].slug]))
		return
	}
}

</script>


<template>
	<section class="scolcours-container">
		<filtered-list
			:list="chapters"
			list-class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-10"
			@enter="triggerEnter"
		>
			<template #button>
				<ChapiterIndexCreateAdmin />
			</template>

			<template #card="{ item }: { item: Object }">
				<InertiaLink
					:class="{ 'opacity-30 hover:opacity-70 transition-all': +item['active'] === 0, }"
					class="text-xl
					block h-full rounded shadow space-y-3
					bg-white dark:bg-gray-800
					cursor-pointer
					transition-all"
					:href="route('themes.chapters.intro', [usePage().props.theme.slug, item['slug']])"
				>
					<h3
						class="text-xl px-5 py-3 rounded-t truncate"
						v-theme.bg.text
						v-katex.auto="item['title']"
					/>

					<markdown-it
						class="px-5 pb-3"
						:text="item['block']['body']"
					/>
				</InertiaLink>
			</template>
		</filtered-list>
	</section>
</template>
