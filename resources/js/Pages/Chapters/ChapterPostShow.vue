<script lang="ts" setup>

import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type {ChapterShowInterface, PostInterface, PostShowInterface} from "@/types/modelInterfaces"
import {usePage} from "@inertiajs/vue3"
import axios from "axios"
import PostDisplay from "@/Components/Posts/PostDisplay.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	post: PostShowInterface,
	anchor: string | null
}>()

function storeCurrentPost() {
	if (usePage().props.auth.user === null) return
	// TODO: Manage page history
	// axios.post(
	// 	route("chapters.currentPost", [props.chapter.id]),
	// 	{
	// 		post_id: props.post.id
	// 	}
	// )
}

storeCurrentPost()

</script>

<template>
	<post-display
		:chapter
		:post
		:return-link="{
			label: chapter.title,
			url: route('chapters.show', {chapter: chapter.slug})
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
			<chapter-formulas-slider :chapter-slug="chapter.slug" />
		</template>
	</post-display>
</template>

