<script lang="ts" setup>

import { computed, nextTick, onMounted, PropType, provide, ref } from "vue"
import type { BlockInterface, ChapterInterface, PostInterface } from "@/types/modelInterfaces"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import QuestionsIndex from "@/Pages/Questions/QuestionsIndex.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"
import { PiMath } from "pimath/esm"
import axios from "axios"

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

// Les groupedBlocks peuvent être groupé pour former un unique groupe.
// Il s'agit surtout d'une mise en page
const blocks = ref<BlockInterface[]>(props.post.blocks)
const groupedBlocks = computed(() => {
	// TODO: work without groups and merge cleverly based on previous / next block
	// The groupedBlocks might be grouped
	let arr: BlockInterface[][] = []

	blocks.value.forEach(block => {
		block.merge === true ? arr[arr.length - 1].push(block) : arr.push([block])
	})

	return arr
})

const iteration = ref(0)
const postData = ref({})

function loadDataScript() {
	iteration.value ++
	try {
		if (props.post.script) {
			const F = new Function("PiMath", "iteration", props.post.script)
			postData.value = F(PiMath, iteration.value)
		}
	} catch (e) {
		console.warn("Post script generator error", e)
		postData.value = {}
	}
}
const hasData = computed(() => {
	return Object.keys(postData.value).length > 0
})
loadDataScript()

provide("postData", postData)
provide('postBlocks', blocks)


function addBlock() {
	axios.post(
		route("posts.blocks.store",[props.post.id])
	).then((res) => {
		blocks.value.push(res.data)
	})
}

function storeCurrentPost(){
	axios.post(
		route("chapters.currentPost", [props.chapter.id]),
		{
			post_id: props.post.id,
			open: true
		}
	)
}

onMounted(() => {
	// TODO: save the last visited post or perhaps last question ?
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
				<div>
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

					<Link
						:href="route('chapters.show', [chapter.slug])"
						class="hover:pl-2 transition-all"
					>
						<i class=" bi bi-chevron-double-right mr-1" />{{ chapter.title }}
					</Link>
				</div>

				<div>
					<button
						class="text-black text-xl"
						v-admin
						@click="addBlock"
					>
						<i class="bi bi-plus-circle" />
					</button>

					<button
						v-if="hasData"
						@click="loadDataScript"
						v-theme.text
						class="btn btn-xs bg-white font-semibold hover:shadow"
					>
						<i class="bi bi-shuffle mr-2" />aléatoire
					</button>
				</div>
			</div>
		</header>

		<!-- show the groupedBlocks, questions and TOC -->
		<main class="scolcours-container mt-5 space-y-5">
			<!-- show the groupedBlocks -->

			<article class="flex flex-col gap-4">
				<div
					v-for="group in groupedBlocks"
					:key="group[0].id"
					class="shadow"
				>
					<block-show
						v-for="(block, index) in group"
						:key="`block-${block.id}`"
						:block="block"
						:group-index="index"
					/>
				</div>
			</article>


			<!-- show the questions -->
			<questions-index
				:chapter="chapter"
				:post="post"
			/>

			<!-- navigation -->
			<chapter-nav
				:chapter="chapter"
				:current-post="post.order"
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
