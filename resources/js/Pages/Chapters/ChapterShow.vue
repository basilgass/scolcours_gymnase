<script
	lang="ts"
	setup
>
import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import ChapterRelations from "@/Components/Chapters/ChapterRelations.vue"
import ChapterTheorems from "@/Components/Chapters/ChapterTheorems.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import EditLink from "@/Components/Ui/EditLink.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import { ChallengeInterface, ChapterInterface, ChapterShowInterface, PostInterface } from "@/types/modelInterfaces"
import { ref } from "vue"

defineOptions({ layout: LayoutMain })

defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	challenges: ChallengeInterface[],
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

			<!--Liste d'icône design pour afficher les éléments -->
			<div class="w-full flex justify-center gap-4 mb-5">
				<div
					v-theme.bg.text
					class="aspect-square w-[120px] grid place-items-center rounded-2xl
						hover:shadow transition-all cursor-pointer"
					@click="currentTab = 'requires'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-card-checklist text-3xl" />
						<p>prérequis</p>
					</div>
				</div>
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
					@click="currentTab = 'challenges'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-patch-question text-3xl" />
						<p>challenges</p>
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

			<!-- liste des prérequis -->
			<chapter-relations
				v-show="currentTab==='requires'"
				:chapter
				:relations
			/>

			<!-- liste des formules -->
			<chapter-formulas
				v-if="showFormular"
				v-show="currentTab==='formulas'"
				:chapter-slug="chapter.slug"
			/>

			<!-- liste des challenges -->
			<chapter-challenges
				v-show="currentTab==='challenges'"
				:challenges
				:chapter
			/>

			<!-- liste des théorèmes -->
			<chapter-theorems
				v-if="showTheorem"
				v-show="currentTab==='theorems'"
				:chapter-slug="chapter.slug"
			/>
		</main>
	</section>
</template>
