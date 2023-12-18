<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>

<script setup>
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import { computed, ref } from "vue"
import { useForm } from "@inertiajs/vue3"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let props = defineProps({
	theme: {
		type: Object,
		default: () => {
		}
	},
	chapters: {
		type: Object,
		default: () => {
		}
	}
})

let chaptersFilter = ref(""),
	root = ref(null)

let chaptersFiltered = computed(() => {
	if (chaptersFilter.value === "") {
		return props.chapters.data
	}

	let filter = chaptersFilter.value.toLowerCase()

	return props.chapters.data.filter(
		(chapter) =>
			chapter.slug.toLowerCase().includes(chaptersFilter.value) ||
			chapter.title.toLowerCase().includes(chaptersFilter.value) ||
			chapter.block.body
				?.toLowerCase()
				.includes(chaptersFilter.value)
	)
})

let showDialog = ref(false)
const newChapterForm = useForm({
	title: "exemple"
})

function createNewChapter() {
	newChapterForm.post(route("themes.chapters.store", [props.theme.slug]))
}
</script>

<template>
	<div ref="root">
		<div class="flex justify-between items-center">
			<ArticleTitle :title="theme.title" />

			<button
				v-admin
				class="btn-primary btn-xs"
				@click="showDialog = true"
			>
				Créer un chapitre
			</button>
		</div>

		<div>
			<form-maker
				v-if="chapters.data.length > 3"
				v-model="chaptersFilter"
				autocomplete="off"
				label="filtrer les chapitres"
				@cancel="chaptersFilter = ''"
			/>
		</div>

		<div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-5">
			<transition-group
				v-if="chaptersFiltered.length > 0"
				name="list"
			>
				<Link
					v-for="chapter in chaptersFiltered"
					:key="`chapter-${chapter.slug}`"
					:class="{ 'border-red-500': chapter.active === 0 }"
					:href="
						route('theme.chapter.intro', [
							$page.props.theme.slug,
							chapter.slug,
						])
					"
					class="panel bg-white border border-gray-200 px-4 py-2 rounded-xl border transition-all cursor-pointer hover:scale-105 hover:shadow transition-all duration-300"
				>
					<div
						v-katex.auto="chapter.title"
						class="text-2xl block mb-5 cursor-pointer"
					/>
					<illustration-show
						v-if="chapter.block.illustrations.length > 0"
						:illustration="chapter.block.illustrations[0]"
						class="mb-3"
					/>
					<div v-katex.auto="chapter.block.body" />
				</Link>
			</transition-group>
		</div>

		<dialog-modal
			v-model="showDialog"
			class="max-w-xl mx-auto p-5"
		>
			<div class="grid grid-cols-1 gap-4">
				<form-maker
					v-model="newChapterForm.title"
					:focus="true"
					label="Nouveau chapitre"
					@cancel="showDialog = false"
					@enter="createNewChapter"
				/>
				<button
					class="btn btn-primary"
					@click="createNewChapter"
				>
					Créer un nouveau chapitre
				</button>
			</div>
		</dialog-modal>
	</div>
</template>

<style scoped></style>
