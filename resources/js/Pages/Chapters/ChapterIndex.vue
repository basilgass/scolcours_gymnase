<script lang="ts" setup>
import ChapterCard from "@/Components/Chapters/ChapterCard.vue"
import ChapiterIndexCreateAdmin from "@/Components/Chapters/ChapterIndexCreateAdmin.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ChapterShowInterface } from "@/types/modelInterfaces"
import { router } from "@inertiajs/vue3"

defineOptions({ layout: LayoutMain })

defineProps<{
	chapters: ChapterShowInterface[]
}>()

function triggerEnter(items: ChapterShowInterface[]) {
	// si il n'y a qu'un élément afficher, on le charge.
	if (items.length === 1) {
		router.visit(route("chapters.show", [items[0].id]))
		return
	}
}
</script>

<template>
	<section class="scolcours-container">
		<filtered-list
			:list="chapters"
			class=""
			list-class="columns-xs space-y-5"
			@enter="triggerEnter"
		>
			<template #button>
				<ChapiterIndexCreateAdmin />
			</template>

			<template #card="{ item }: { item: ChapterShowInterface }">
				<chapter-card :chapter="item" />
			</template>
		</filtered-list>
	</section>
</template>
