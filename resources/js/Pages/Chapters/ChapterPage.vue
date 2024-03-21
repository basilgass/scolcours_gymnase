<script setup lang="ts">
import { computed, defineAsyncComponent, reactive, ref } from "vue"
import PostShow from "@/Components/Posts/PostShow.vue"
import { useMenuScrollTo } from "@/Composables/useHelpers"
import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import axios from "axios"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
		chapter: {type: Object, required: true}
	}),
	theChapter = reactive(props.chapter.data)

const showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Chapters/ChapterForm.vue")
		)
	})

const addPost = function () {
		axios.post(
			route("chapters.posts.store", [theChapter.slug]),
			{
				title: "nouvel article",
			}
		)
			.then(res => {
				const post = res.data
				theChapter.posts[post.order] = post
			})
			.catch(err => console.warn(err))
	},
	destroyPost = function (id) {
		delete theChapter.posts[id]
	}
</script>

<template>
	<main>
		<div class="flex justify-between items-baseline">
			<h1 class="text-2xl md:text-3xl xl:text-4xl my-5">
				{{ theChapter.title }}
			</h1>

			<div v-admin>
				<button
					class="text-xs"
					@click="showEditForm=true"
				>
					<i class="bi bi-pencil mr-2" /> {{ theChapter.id }}
				</button>

				<div v-if="showEditForm">
					<component
						:is="editForm"
						v-model="showEditForm"
						:chapter="theChapter"
					/>
				</div>
			</div>
		</div>

		<!-- Table of content -->
		<div
			v-if="theChapter.posts"
			class="my-5"
		>
			<h3 class="uppercase font-extralight mb-2">
				table des matières
			</h3>

			<div class="columns-1 md:columns-2 lg:columns-3 column-toc gap-8 space-y-4">
				<button
					v-for="post in theChapter.posts"
					:key="`toc-${post.id}`"
					class="block hover:pl-5 transition-all duration text-left"
					@click="useMenuScrollTo(`post-${post.id}`)"
				>
					<i
						:class="{
							'bi bi-calculator': post.type==='exercise',
							'bi bi-text-paragraph': !post.type
						}"
					/>
					<span
						v-katex.auto="post.title"
						class="ml-2"
					/>
				</button>
			</div>
		</div>

		<!-- The challenges -->
		<chapter-challenges :chapter="theChapter" />

		<!-- The formulas -->
		<chapter-formulas :chapter-slug="theChapter.slug" />

		<section>
			<div
				v-if="theChapter.posts"
				class="space-y-10"
			>
				<post-show
					v-for="post in theChapter.posts"
					:id="`post-${post.id}`"
					:key="`post-${post.id}`"
					:chapter="theChapter"
					:post="post"
					isolate
					@destroy="destroyPost"
				/>
			</div>

			<div
				v-admin
				class="mt-10"
			>
				<button
					class="btn-new"
					@click="addPost"
				>
					Ajouter un article {{ theChapter.posts.length }}
				</button>
			</div>
		</section>
	</main>
</template>
