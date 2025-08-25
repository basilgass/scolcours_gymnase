<script lang="ts" setup>

import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {ChapterShowInterface, PostInterface, PostShowInterface} from "@/types/modelInterfaces"
import PostDisplay from "@/Components/Posts/PostDisplay.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	post: PostShowInterface,
	anchor: string | null
}>()

// Charge les scores des questions en une seule fois
const useScore = useStoreScore()
useScore.getScores('Question', props.post.questions.map(q => q.id))

</script>

<template>
	<post-display
		:chapter
		:post
		:return-link="{
			label: chapter.title,
			url: route('chapters.show', {chapter: chapter.id})
		}"
	>
		<template #footer>
			<!-- navigation -->
			<chapter-nav
				:chapter
				:posts
				:current-post-id="post.id"
			/>

			<!-- table of contents -->
			<chapter-toc
				:active="post.id"
				:chapter
				:posts
				class="mt-10"
			/>

			<!-- Show the formulas -->
			<chapter-formulas-slider :chapter />
		</template>
	</post-display>
</template>

