<template>
	<section
		class="bg-white border border-gray-200 rounded shadow py-5 mt-5"
	>
		<h1
			v-katex.auto="theChapter.title"
			class="px-5 border-b border-gray-200 pb-5 text-xl md:text-2xl xl:text-3xl"
		/>

		<div class="space-y-10">
			<!-- table des matieres -->
			<ChapterToc
				class="px-5"
				:chapter="theChapter"
			/>

			<!-- commencer l'aventure -->
			<div class="w-full text-center px-5">
				<Link
					class="min-h-[80px] mx-auto w-full md:w-auto md:px-20"
					:class="`btn-scolcours-${$page.props.theme.slug}`"
					as="button"
					:href="route('theme.chapter.slide', [$page.props.theme.slug, theChapter.slug, 1])"
				>
					<div class="flex flex-col gap-3 py-3 text-xs font-ultrathin">
						<p>
							Commencer l'aventure avec
						</p>
						<h2
							v-katex.auto="theChapter.posts[0].title"
							class="text-xl"
						/>
					</div>
				</Link>
			</div>

			<!-- liste des challenges -->
			<chapter-challenges :chapter="theChapter" />

			<!-- The formulas -->
			<chapter-formulas :chapter-slug="theChapter.slug" />
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, onMounted, ref} from "vue"
import PostShow from "@/Components/Posts/PostShow.vue"
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"

let props = defineProps({
		chapter: {type: Object, required: true},
		nav: {type: Object, required: true}
	}),
	theChapter = ref(props.chapter.data)

</script>
