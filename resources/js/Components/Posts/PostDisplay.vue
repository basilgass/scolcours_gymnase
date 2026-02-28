<script lang="ts" setup>

import BlocksIndex from "@/Components/Blocks/BlocksIndex.vue"
import QuestionsIndex from "@/Components/Questions/QuestionsIndex.vue"
import {useScriptLoader} from "@/Composables/useScriptLoader.ts"
import type {BlockInterface, PostShowInterface} from "@/types/modelInterfaces"
import {nextTick, onMounted, provide, ref} from "vue"
import {useScrollTo} from "@/Composables/useHelpers.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import ContentSeparator from "@/Components/Ui/ContentSeparator.vue"
import dayjs from "dayjs"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"

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
		nextTick(() => useScrollTo('#' + props.anchor))
	}
})

const toBeRevised = ref<boolean>(props.post.revise)

function postRevised() {
	toBeRevised.value = !toBeRevised.value

	axios.patch(
		route("api.admin.posts.revised",
			{post: props.post.id, revise: toBeRevised.value}
		))
		.then(() => {
			// Do nothing.
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}
</script>

<template>
	<section>
		<div
			v-if="toBeRevised"
			v-admin
			class="border border-dashed
			rounded-xl p-3 flex justify-between
			border-orange-500 bg-orange-100"
		>
			<div>A réviser</div>
			<sc-button
				type="edit"
				xs
				@click="postRevised"
			>
				révision faite
			</sc-button>
		</div>
		<header
			v-if="!noTitle"
			v-theme.text
			class="min-h-[80px] w-full py-2"
		>
			<!-- title -->
			<article-title
				:edit-link="{
					label: post.id,
					url: route('admin.posts.edit', {post: post.id})
				}"
				:return-link
				:title="post.title"
			/>
		</header>
		<header>
			<div class="w-full flex flex-col md:flex-row justify-between items-baseline">
				<div class="font-code text-xs">
					Dernière mise à jour le
					{{ dayjs(post.updated_at).format('D MMMM YYYY à HH:mm') }}
				</div>

				<div class="flex gap-3 items-baseline">
					<div
						v-admin
						class="text-black text-xs"
					>
						<div
							v-if="!post.active"
							class="font-code font-semibold"
						>
							{ brouillon }
						</div>
					</div>

					<sc-button
						v-if="postScript.hasData.value "
						outline
						theme
						type="generate"
						xs
						@click="postScript.run()"
					>
						<i class="bi bi-shuffle mr-2" />aléatoire
					</sc-button>
				</div>
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

