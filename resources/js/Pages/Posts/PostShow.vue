<script lang="ts" setup>

import BlocksIndex from "@/Components/Blocks/BlocksIndex.vue"
import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"
import { useScriptLoader } from "@/Composables/useScriptLoader.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { BlockInterface, ChapterShowInterface, PostInterface, PostShowInterface } from "@/types/modelInterfaces"
import { usePage } from "@inertiajs/vue3"
import axios from "axios"
import { nextTick, onMounted, provide, ref } from "vue"

defineOptions({ layout: LayoutMain })

const props = defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	post: PostShowInterface,
	anchor: string | null
}>()


const blocks = ref<BlockInterface[]>(props.post.blocks)

const postScript = useScriptLoader(props.post.script)
postScript.run()
provide("postScript", postScript)

function storeCurrentPost() {
	if (usePage().props.auth.user === null) return
	axios.post(
		route("chapters.currentPost", [props.chapter.id]),
		{
			post_id: props.post.id
		}
	)
}

onMounted(() => {
	storeCurrentPost()

	if (props.anchor) {
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
			<div class="scolcours-container flex justify-between">
				<div class="scolcours-header-left">
					<div class="flex gap-5 items-baseline">
						<h1
							v-katex.auto="post.title"
							class="text-LG md:text-2xl l:text-3xl"
						/>
						<edit-link
							:id="post.id"
							class="!text-black top-1"
							inline
							route-name="posts.edit"
						/>
					</div>

					<InertiaLink
						:href="route('chapters.show', [chapter.slug])"
						class="hover:pl-2 transition-all"
					>
						<i class=" bi bi-chevron-double-right mr-1" />
						<span v-katex.auto="chapter.title" />
					</InertiaLink>
				</div>

				<div class="scolcours-header-right">
					<div
						v-admin
						class="flex items-center gap-3 text-black"
					>
						<div
							v-if="!post.active"
							class="font-code font-semibold"
						>
							{ brouillon }
						</div>
					</div>

					<button
						v-if="postScript.hasData.value"
						v-theme.text
						class="btn btn-xs bg-white font-semibold hover:shadow"
						@click="postScript.run()"
					>
						<i class="bi bi-shuffle mr-2" />aléatoire
					</button>
				</div>
			</div>
		</header>

		<!-- show the groupedBlocks, questions and TOC -->
		<main class="scolcours-container mt-5 space-y-5">
			<!-- show the groupedBlocks -->
			<blocks-index
				v-model="blocks"
				:post-id="post.id"
			/>

			<!-- show the questions -->
			<questions-index
				:post="post"
			/>

			<!-- navigation -->
			<chapter-nav
				:chapter
				:posts
				:current-post="post.order"
			/>

			<!-- table of contents -->
			<chapter-toc
				:active="post.order"
				:chapter
				:posts
				class="mt-10"
			/>

			<!-- Show the formulas -->
			<chapter-formulas-slider :chapter-slug="chapter.slug" />
		</main>
	</section>
</template>

