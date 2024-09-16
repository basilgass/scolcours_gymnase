<script
	lang="ts"
	setup
>

import ChapterFormulasSlider from "@/Components/Chapters/ChapterFormulasSlider.vue"
import ChapterNav from "@/Components/Chapters/ChapterNav.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"
import QuestionsIndex from "@/Pages/Questions/QuestionsIndex.vue"
import { flashInterface } from "@/types"
import type { BlockInterface, ChapterInterface, PostInterface } from "@/types/modelInterfaces"
import { usePage } from "@inertiajs/vue3"
import axios from "axios"
import  PiMath from "pimath"
import { computed, inject, nextTick, onMounted, PropType, provide, ref } from "vue"

defineOptions({ layout: LayoutMain })

const editMode = inject<boolean>("editMode")
const flash = inject<flashInterface>("flash")

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
	iteration.value++
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


function addBlock(after?: number) {
	axios.post(
		route("posts.blocks.store", [props.post.id]),
		{
			after: after === undefined ? null : after
		}
	).then((res) => {
		flash.success("Block ajouté avec succès.")
		if (after === undefined) {
			blocks.value.push(res.data)
		} else {
			blocks.value.splice(after + 1, 0, res.data)
		}
	}).catch((res) => {
		flash.error("Erreur lors de l'ajout du block.")
		console.warn("add block: ", res.data)
	})
}

function storeCurrentPost() {
	if (usePage().props.auth.user === null) return
	axios.post(
		route("chapters.currentPost", [props.chapter.id]),
		{
			post_id: props.post.id,
			open: true
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

					<InertiaLink
						:href="route('chapters.show', [chapter.slug])"
						class="hover:pl-2 transition-all"
					>
						<i class=" bi bi-chevron-double-right mr-1" />
						<span v-katex.auto="chapter.title" />
					</InertiaLink>
				</div>

				<div>
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

						<button
							class="text-xl"
							@click="addBlock()"
						>
							<i class="bi bi-plus-circle" />
						</button>
					</div>

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
				>
					<div
						class="shadow relative"
						v-for="(block, index) in group"
						:key="`block-${block.id}`"
					>
						<div
							v-admin="editMode"
							class="absolute -right-2 -bottom-2
											w-[28px] h-[28px]
											bg-white grid place-items-center pt-[0.15em]
											rounded-full border shadow hover:bg-black hover:text-white transition-colors duration-500 cursor-pointer"
							@click="addBlock(block.order)"
						>
							<i class="bi bi-plus-circle" />
						</div>
						<block-show
							:block="block"
							:group-index="index"
						/>
					</div>
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

<style scoped></style>
