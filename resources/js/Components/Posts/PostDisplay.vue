<script lang="ts" setup>

import BlocksIndex from "@/Components/Blocks/BlocksIndex.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import {useScriptLoader} from "@/Composables/useScriptLoader.ts"
import type {BlockInterface, PostShowInterface} from "@/types/modelInterfaces"
import {nextTick, onMounted, provide, ref} from "vue"
import {useMenuScrollTo} from "@/Composables/useHelpers.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import ContentSeparator from "@/Components/Ui/ContentSeparator.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

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

const scoreStore = useStoreScore()
const score = await scoreStore.getScore('Post', props.post.id)


function updatePostScore() {
	// Mise à jour du score du post.
	const nb_of_questions = props.post.questions.length
	const answered_questions = props.post.questions.filter(question => question.user.is_resolved).length
	score.score = Math.round(answered_questions / nb_of_questions * 100)
	score.is_resolved = nb_of_questions === answered_questions

	scoreStore.updateScore(score)
		.then(() => {
			// TODO: update lesson
		})
}


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
							url: route('admin.posts.edit', {id: post.id})
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
				:post="post"
				@validate="updatePostScore"
			/>

			<slot name="footer" />
		</main>
	</section>
</template>

