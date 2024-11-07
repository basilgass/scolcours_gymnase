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
import type { ChapterInterface } from "@/types/modelInterfaces"
import { PropType, ref } from "vue"

defineOptions({ layout: LayoutMain })

defineProps({
	chapter: { type: Object as PropType<ChapterInterface>, required: true }
})

const showTheorem = ref(false)

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

		<div class="scolcours-container space-y-10">
			<!-- table des matières -->
			<ChapterToc :chapter="chapter" />

			<!-- commencer l'aventure -->
			<div
				v-if="chapter.posts.length > 0"
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
					class="min-h-[80px] mx-auto w-full md:w-auto md:px-20"
				>
					<div class="flex flex-col gap-3 py-3 text-xs font-ultrathin">
						<p>Commencer l'aventure avec</p>
						<h2
							v-katex.auto="chapter.posts[0].title"
							class="text-xl"
						/>
					</div>
				</InertiaLink>
			</div>

			<!-- liste des relations -->
			<chapter-relations :chapter="chapter" />

			<!-- liste des challenges -->
			<chapter-challenges :chapter="chapter" />

			<!-- The formulas -->
			<chapter-formulas
				:chapter-slug="chapter.slug"
				responsive
			/>

			<div>
				<button
					v-if="!showTheorem"
					v-theme.text
					class="uppercase"
					@click="showTheorem = true"
				>
					Afficher toute la théorie
				</button>
				<chapter-theorems
					v-else
					:chapter-slug="chapter.slug"
					class="mt-20"
				/>
			</div>
		</div>
	</section>
</template>
