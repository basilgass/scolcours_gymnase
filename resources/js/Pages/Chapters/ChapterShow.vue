<script lang="ts" setup>

import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import ChapterRelations from "@/Components/Chapters/ChapterRelations.vue"
import ChapterTheorems from "@/Components/Chapters/ChapterTheorems.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeMinInterface, ChapterInterface, ChapterShowInterface, PostInterface} from "@/types/modelInterfaces"
import {computed, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import {usePage} from "@inertiajs/vue3"
import {vIntersectionObserver} from '@vueuse/components'

defineOptions({layout: LayoutMain})

const props = defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	challenges: ChallengeMinInterface[],
	relations: ChapterInterface[]
}>()

const theme = computed(() => usePage().props.themes[props.chapter.theme_id])
const editMode = useStoreEditMode()

const currentTab = ref<"requires" | "formulas" | "challenges" | "theorems" | undefined>(undefined)
const showTheorem = ref(false)
const showFormular = ref(false)

function onIntersectionObserver([entry]: IntersectionObserverEntry[]) {
	if (showFormular.value) return

	showFormular.value = entry?.isIntersecting ?? false
}

</script>
<template>
	<section>
		<article-title
			v-theme.text
			:title="chapter.title"
			:edit-link="{
				label: chapter.id,
				url: route('admin.chapters.edit', {chapter: chapter.id})
			}"
		/>

		<main class=" py-10 space-y-12">
			<chapter-toc
				:chapter
				:posts
			/>

			<!-- commencer l'aventure -->
			<div
				v-if="posts.length > 0"
			>
				<sc-button
					class="min-w-50 md:px-20 rounded-xl mx-auto"
					theme
					:href="route('themes.chapters.posts.show', {
						theme: theme.slug,
						chapter: chapter.slug,
						order: posts[0].order,
					})"
				>
					<div class="flex flex-col gap-3 py-3 text-xs font-ultrathin">
						<p>Commencer l'aventure avec</p>
						<h2
							v-katex.auto="posts[0].title"
							class="text-xl"
						/>
					</div>
				</sc-button>
			</div>

			<!-- liste des prérequis -->
			<chapter-relations
				:chapter
				:relations
			/>

			<!-- liste des challenges -->
			<chapter-challenges
				v-if="challenges.length>0 || ($page.props.auth.can.admin && editMode.enable)"
				:challenges
				:chapter
			/>

			<!-- liste des formules -->
			<div v-intersection-observer="onIntersectionObserver">
				<chapter-formulas
					v-if="showFormular"
					:chapter="chapter"
				/>
			</div>

			<div>
				<sc-button
					theme
					class="aspect-square w-[120px]
						grid place-items-center
						hover:rounded-[20px]"
					@click="showTheorem = true; currentTab = 'theorems'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-book text-3xl" />
						<p>théorie</p>
					</div>
				</sc-button>
				<!-- liste des théorèmes -->
				<chapter-theorems
					v-if="showTheorem"
					v-show="currentTab==='theorems'"
					:chapter-slug="chapter.slug"
				/>
			</div>
		</main>
	</section>
</template>
