<script lang="ts" setup>

import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import ChapterRelations from "@/Components/Chapters/ChapterRelations.vue"
import ChapterTheorems from "@/Components/Chapters/ChapterTheorems.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import EditLink from "@/Components/Ui/EditLink.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {
	ChallengeMinInterface,
	ChapterInterface,
	ChapterShowInterface,
	PostInterface
} from "@/types/modelInterfaces"
import { ref } from "vue"

defineOptions({ layout: LayoutMain })

defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	challenges: ChallengeMinInterface[],
	relations: ChapterInterface[]
}>()

const currentTab = ref<"requires" | "formulas" | "challenges" | "theorems" | undefined>(undefined)
const showTheorem = ref(false)
const showFormular = ref(false)

</script>
<template>
	<section>
		<header
			v-theme.bg.text
			class="py-6 lg:flex-row justify-between bg-opacity-80"
		>
			<!-- title -->
			<div class="scolcours-container relative">
				<edit-link
					:id="chapter.id"
					class="!text-black top-1 right-3"
					route-name="chapters.edit"
				/>
				<h1
					v-katex.auto="chapter.title"
					class="text-xl md:text-3xl l:text-5xl"
				/>
			</div>
		</header>

		<main class="scolcours-container py-10 space-y-12">
			<chapter-toc
				v-theme.border
				class="box"
				:chapter
				:posts
			/>

			<!-- commencer l'aventure -->
			<div
				v-if="posts.length > 0"
				class="w-full text-center"
			>
				<InertiaLink
					v-theme.bg.text
					:href="route('themes.chapters.slide', [
						$page.props.theme.slug,
						chapter.slug,
						1,
					])"
					as="button"
					class="min-h-[80px] mx-auto w-full md:w-auto md:px-20 rounded-xl shadow"
				>
					<div class="flex flex-col gap-3 py-3 text-xs font-ultrathin">
						<p>Commencer l'aventure avec</p>
						<h2
							v-katex.auto="posts[0].title"
							class="text-xl"
						/>
					</div>
				</InertiaLink>
			</div>

			<!-- liste des prérequis -->
			<chapter-relations
				v-theme.border
				class="box"
				:chapter
				:relations
			/>

			<!-- liste des challenges -->
			<chapter-challenges
				v-theme.border
				class="box"
				:challenges
				:chapter
			/>

			<!--Liste d'icône design pour afficher les éléments -->
			<div class="w-full flex justify-center gap-4 mb-5">
				<div
					v-theme.bg.text
					class="aspect-square w-[120px] grid place-items-center rounded-2xl
						hover:shadow transition-all cursor-pointer"
					@click="showFormular = true; currentTab = 'formulas'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-table text-3xl" />
						<p>formulaire</p>
					</div>
				</div>

				<div
					v-theme.bg.text
					class="aspect-square w-[120px] grid place-items-center rounded-2xl
						hover:shadow transition-all cursor-pointer"
					@click="showTheorem = true; currentTab = 'theorems'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-journal-bookmark text-3xl" />
						<p>théorie</p>
					</div>
				</div>
			</div>


			<!-- liste des formules -->
			<div>
				<chapter-formulas
					v-if="showFormular"
					v-show="currentTab==='formulas'"
					:chapter-slug="chapter.slug"
				/>


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
<style scoped>

.box {
	@apply bg-white dark:bg-gray-900 border rounded-xl px-5 py-3;
}
</style>
