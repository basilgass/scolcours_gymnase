<script lang="ts" setup>

import BlocksIndex from "@/Components/Blocks/BlocksIndex.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import {useScriptLoader} from "@/Composables/useScriptLoader.ts"
import type {BlockInterface, PostShowInterface} from "@/types/modelInterfaces"
import {nextTick, onMounted, provide, ref} from "vue"
import {useMenuScrollTo} from "@/Composables/useHelpers.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import ContentSeparator from "@/Components/Ui/ContentSeparator.vue"

const props = defineProps<{
	post: PostShowInterface,
	noTitle?: boolean,
	anchor?: string | null,
	returnLink?: {
		label: string,
		url: string,
	},
}>()

const blocks = ref<BlockInterface[]>(props.post.blocks)
const postScript = useScriptLoader(props.post.script)
postScript.run()
provide("postScript", postScript)


onMounted(() => {
	if (props.anchor) {
		nextTick(() => useMenuScrollTo(props.anchor))
	}
})

</script>

<template>
	<section>
		<header
			v-if="!noTitle"
			v-theme.text
			class="flex justify-between
				min-h-[80px] w-full py-2"
		>
			<!-- title -->
			<div class="flex-1">
				<div class="flex gap-5 items-baseline">
					<article-title
						:title="post.title"
						:return-link
						:edit-link="{
							label: post.id,
							url: route('admin.posts.edit', {post: post.id})
						}"
					/>
				</div>
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
				</div>

				<button
					v-if="postScript.hasData.value"
					v-theme.text
					class="btn btn-xs bg-white font-semibold hover:shadow-sm"
					@click="postScript.run()"
				>
					<i class="bi bi-shuffle mr-2" />aléatoire
				</button>
			</div>
		</header>

		<!-- show the groupedBlocks, questions and TOC -->
		<main>
			<!-- show the groupedBlocks -->
			<blocks-index
				v-model="blocks"
				:post-id="post.id"
			/>

			<content-separator />

			<!-- show the questions -->
			<questions-index
				:container="{
					id: post.id,
					type: 'Post',
					questionsGrid: post.questionsGrid
				}"
				:questions="post.questions"
			/>

			<slot name="footer" />
		</main>
	</section>
</template>

