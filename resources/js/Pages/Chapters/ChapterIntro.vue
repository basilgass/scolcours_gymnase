<template>
	<section
		class="bg-white border border-gray-200 rounded shadow py-5 mt-5"
	>
		<Head :title="`${theChapter.title} - ${$page.props.theme.title}`" />

		<div class="flex justify-between items-baseline px-5 border-b border-gray-200 pb-5 ">
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

		<div class="space-y-10">
			<!-- table des matieres -->
			<ChapterToc
				:chapter="theChapter"
				class="px-5"
			/>

			<!-- commencer l'aventure -->
			<div
				v-if="theChapter.posts.length>0"
				class="w-full text-center px-5"
			>
				<Link
					:class="`btn-scolcours-${$page.props.theme.slug}`"
					:href="route('theme.chapter.slide', [$page.props.theme.slug, theChapter.slug, 1])"
					as="button"
					class="min-h-[80px] mx-auto w-full md:w-auto md:px-20"
				>
					<div class="flex flex-col gap-3 py-3 text-xs font-ultrathin">
						<p>
							Commencer l'aventure avec
						</p>
						<h2
							v-katex.auto="theChapter.posts[0].title"
							class="text-xl"
						/>
					</div>
				</Link>
			</div>

			<!-- liste des challenges -->
			<chapter-challenges :chapter="theChapter" />

			<!-- The formulas -->
			<chapter-formulas
				:chapter-slug="theChapter.slug"
				responsive
			/>
		</div>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import {computed, defineAsyncComponent, inject, ref} from "vue"
import ChapterToc from "@/Components/Chapters/ChapterToc.vue"
import ChapterChallenges from "@/Components/Chapters/ChapterChallenges.vue"
import ChapterFormulas from "@/Components/Chapters/ChapterFormulas.vue"
import {Head} from "@inertiajs/vue3"

let props = defineProps({
		chapter: {type: Object, required: true},
		nav: {type: Object, required: true}
	}),
	theChapter = ref(props.chapter.data)

const editMode = inject("editMode")

let showEditForm = ref(false),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Chapters/ChapterForm.vue")
		)
	})
</script>
