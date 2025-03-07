<script lang="ts" setup>

import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import ChapterRelations from "@/Components/Chapters/ChapterRelations.vue"
import ChapterTheorems from "@/Components/Chapters/ChapterTheorems.vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import EditLink from "@/Components/Ui/EditLink.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeMinInterface, ChapterInterface, ChapterShowInterface, PostInterface} from "@/types/modelInterfaces"
import {ref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

defineOptions({layout: LayoutMain})

defineProps<{
	chapter: ChapterShowInterface,
	posts: PostInterface[],
	challenges: ChallengeMinInterface[],
	relations: ChapterInterface[]
}>()

const editMode = useStoreEditMode()

const currentTab = ref<"requires" | "formulas" | "challenges" | "theorems" | undefined>(undefined)
const showTheorem = ref(false)
const showFormular = ref(false)

</script>
<template>
	<section>
		<header
			class="py-6 flex items-baseline justify-between"
		>
			<!-- title -->
			<h1
				v-theme.text
				v-katex.auto="chapter.title"
				class="text-xl md:text-3xl l:text-5xl font-semibold"
			/>

			<edit-link
				class="border rounded-full px-2 py-1"
				:id="chapter.id"
				route-name="chapters.edit"
				inline
			/>
		</header>

		<main class=" py-10 space-y-12">
			<chapter-toc
				v-theme.border
				:chapter
				:posts
			/>

			<!-- commencer l'aventure -->
			<div
				v-if="posts.length > 0"
				class="w-full text-center"
			>
				<sc-button
					class="min-w-[200px] md:px-20 rounded-xl"
					theme
					:href="route('themes.chapters.slide', {
						theme: chapter.theme.slug,
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

			<!--Liste d'icône design pour afficher les éléments -->
			<div class="w-full flex justify-center gap-4 mb-5">
				<sc-button
					theme
					class="aspect-square w-[120px]
						grid place-items-center
						hover:rounded-[20px]"
					@click="showFormular = true; currentTab = 'formulas'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-table text-3xl" />
						<p>formulaire</p>
					</div>
				</sc-button>

				<sc-button
					theme
					class="aspect-square w-[120px]
						grid place-items-center
						hover:rounded-[20px]"
					@click="showTheorem = true; currentTab = 'theorems'"
				>
					<div class="text-center space-y-2">
						<i class="bi bi-journal-bookmark text-3xl" />
						<p>théorie</p>
					</div>
				</sc-button>
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
<style scoped lang="postcss">

.box {
	@apply bg-white dark:bg-gray-900 border rounded-xl px-5 py-3;
}
</style>
