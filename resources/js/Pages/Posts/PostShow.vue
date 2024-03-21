<script lang="ts" setup>

import { nextTick, onMounted, PropType } from "vue"
import { ChapterInterface, PostInterface } from "@/types/modelInterfaces"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import QuestionsIndex from "@/Pages/Questions/QuestionsIndex.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	post: {
		type: Object as PropType<PostInterface>,
		required: true
	},
	chapter: {
		type: Object as PropType<ChapterInterface>,
		required: true
	},
	anchor: {
		type: [String, null],
		required: true
	}
})

onMounted(() => {
	// storeCurrentPost()
	if (props.anchor) {
		console.log(props.anchor)
		nextTick(() => useMenuScrollTo(props.anchor))
	}
})
</script>

<template>
	<section>
		<header
			v-theme.bg.text
			class="py-2 lg:flex-row justify-between bg-opacity-80"
		>
			<!-- title -->
			<div class="scolcours-container relative">
				<edit-link
					:id="post.id"
					class="!text-black top-1"
					route-name="posts.edit"
				/>
				<h1
					v-katex.auto="post.title"
					class="text-LG md:text-2xl l:text-3xl"
				/>

				<Link
					:href="route('chapters.show', [chapter.slug])"
					class="hover:pl-2 transition-all"
				>
					<i class=" bi bi-chevron-double-right mr-1" />{{ chapter.title }}
				</Link>
			</div>
		</header>

		<!-- show the blocks, questions and TOC -->
		<main class="scolcours-container mt-5 space-y-5">
			<!-- show the blocks -->
			<article class="flex flex-col gap-4">
				<block-show
					v-for="block in post.blocks"
					:key="`block-${block.id}`"
					:block="block"
					class="bg-white shadow"
				/>
			</article>

			<!-- show the questions -->
			<questions-index
				:post="post"
				:chapter="chapter"
			/>

			<!-- navigation -->
			<chapter-nav
				:current-post="post.order"
				:chapter="chapter"
			/>

			<!-- table of contents -->
			<chapter-toc
				:active="post.order"
				:chapter="chapter"
				class="mt-10"
			/>

			<!-- Show the formulas -->
			<chapter-formulas-slider :chapter="chapter" />
		</main>
	</section>
</template>

<style scoped>

</style>
