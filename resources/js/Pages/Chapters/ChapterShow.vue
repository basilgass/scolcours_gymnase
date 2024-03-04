<script setup lang="ts">
import { computed, defineAsyncComponent, inject, ref } from "vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import { Head } from "@inertiajs/vue3"
import ChapterRelations from "@/Components/Chapters/ChapterRelations.vue"
import ChapterTheorems from "@/Components/Chapters/ChapterTheorems.vue"

import LayoutMain from "@/Layouts/LayoutMain.vue"
import { editModeInterface } from "@/types"

defineOptions({ layout: LayoutMain })

	const props = defineProps({
			chapter: { type: Object, required: true },
			nav: { type: Object, required: true },
		}),
		theChapter = ref(props.chapter.data)

	const editMode = inject<editModeInterface>("editMode")

	const showEditForm = ref(false),
		editForm = computed(() => {
			return defineAsyncComponent(() =>
				import("@/Components/Chapters/ChapterForm.vue"),
			)
		})

	const pageTitle = computed(() => {
		return theChapter.value.meta_title
			? theChapter.value.meta_title
			: theChapter.value.title
	})

	const showFormular = ref(false)
	const showTheorem = ref(false)
</script>
<template>
	<section class="bg-white border border-gray-200 rounded shadow py-5 mt-5">
		<Head :title="pageTitle" />

		<div
			class="flex justify-between items-baseline px-5 border-b border-gray-200 pb-5"
		>
			<h1
				v-katex.auto="theChapter.title"
				class="text-xl md:text-2xl xl:text-3xl"
			/>

			<div
				v-show="editMode.enabled.value"
				v-admin
			>
				<button
					class="text-xs"
					@click="showEditForm = true"
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

		<div class="space-y-10">
			<!-- table des matieres -->
			<ChapterToc
				:chapter="theChapter"
				class="px-5"
			/>

			<!-- commencer l'aventure -->
			<div
				v-if="theChapter.posts.length > 0"
				class="w-full text-center px-5"
			>
				<Link
					v-theme.bg.text
					:href="
						route('theme.chapter.slide', [
							$page.props.theme.slug,
							theChapter.slug,
							1,
						])
					"
					as="button"
					class="min-h-[80px] mx-auto w-full md:w-auto md:px-20"
				>
					<div
						class="flex flex-col gap-3 py-3 text-xs font-ultrathin"
					>
						<p>Commencer l'aventure avec</p>
						<h2
							v-katex.auto="theChapter.posts[0].title"
							class="text-xl"
						/>
					</div>
				</Link>
			</div>

			<!-- liste des relations -->
			<chapter-relations :chapter="theChapter" />

			<!-- liste des challenges -->
			<chapter-challenges :chapter="theChapter" />

			<!-- The formulas -->
			<div>
				<button
					class="px-5 uppercase"
					v-theme.text
					v-if="!showFormular"
					@click="showFormular = true"
				>
					Afficher le formulaire
				</button>
				<chapter-formulas
					v-else
					:chapter-slug="theChapter.slug"
					responsive
				/>
			</div>

			<div>
				<button
					class="px-5 uppercase"
					v-theme.text
					v-if="!showTheorem"
					@click="showTheorem = true"
				>
					Afficher toute la théorie
				</button>
				<chapter-theorems
					v-else
					:chapter-slug="theChapter.slug"
					class="mt-20"
				/>
			</div>
		</div>
	</section>
</template>
