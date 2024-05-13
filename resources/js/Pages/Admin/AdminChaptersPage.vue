<script lang="ts" setup>
import { useForm } from "@inertiajs/vue3"
import { computed, PropType, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import { ChapterInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })
const props = defineProps({
	chapters: {
		type: Object as PropType<ChapterInterface[]>, required: true
	}
})

const filterChapter = ref("")

const Form = useForm({
	slug: "",
	active: false
})

const chapterCurrentTheme = ref<string>("")
const chapterThemes = computed(() => {
	const themes = props.chapters.map((chapter) => chapter.theme)
	themes.sort()
	return [...new Set(themes)]
})

const filtreredChapters = computed(() => {
	let chapters = props.chapters.filter(
		(chapter) =>
			chapter.theme === chapterCurrentTheme.value ||
			chapterCurrentTheme.value === ""
	)
	if (filterChapter.value !== "") {
		chapters = chapters.filter(
			(chapter) =>
				chapter.slug.includes(filterChapter.value) ||
				chapter.title.includes(filterChapter.value)
		)
	}

	return chapters
})

//TODO : add a please wait...
function toggleChapterVisibility(slug, active) {
	Form.slug = slug
	Form.active = active
	Form.patch(`/admin/chapters/${slug}`, {
		preserveScroll: true
	})
}
</script>
<template>
	<section class="scolcours-container">
		<h1 class="text-3xl pt-5 mb-10">
			administration des chapitres
		</h1>

		<article>
			<filtered-list
				:list="chapters"
				list-class="grid grid-cols-1 gap-2"
			>
				<template #card="{item}:{item: ChapterInterface}">
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							<Link :href="`/${item.theme.id}/${item.slug}`">
								{{ item.title }}
							</Link>
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ item.slug }}
						</p>
					</div>
				</template>
			</filtered-list>
			<h2 class="text-lg my-2">
				Chapitres
			</h2>
			<form-maker
				v-model="filterChapter"
				name="filtrer"
				title="Filtrer"
			/>
			<div class="flex gap-5 items-center mt-3 mb-5">
				<div>Filtrer par thèmes:</div>
				<button
					:class="chapterCurrentTheme === '' ? 'btn-success' : ''"
					class="btn btn-xs"
					@click="chapterCurrentTheme = ''"
				>
					Tous
				</button>
				<button
					v-for="(theme, id) of chapterThemes"
					:key="id"
					:class="chapterCurrentTheme === theme ? 'btn-success' : ''"
					class="btn btn-xs"
					@click="chapterCurrentTheme = theme"
				>
					{{ theme }}
				</button>
			</div>

			<div class="w-full">
				<div
					v-for="chapter in filtreredChapters"
					:key="chapter.slug"
					class="hover:bg-gray-200 flex justify-between px-4 py-2"
				>
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							<Link :href="`/${chapter.theme}/${chapter.slug}`">
								{{ chapter.title }}
							</Link>
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ chapter.slug }}
						</p>
					</div>
					<div>
						<div>{{ chapter.updated_at }}</div>
						<button
							:class="{
								'bg-green-600': chapter.active,
								'bg-red-600': !chapter.active,
							}"
							class="btn btn-xs w-full text-white hover:text-gray-800"
							@click="
								toggleChapterVisibility(
									chapter.slug,
									!chapter.active,
								)
							"
						>
							{{ chapter.active ? "en ligne" : "caché" }}
						</button>
					</div>
				</div>
			</div>
		</article>
	</section>
</template>

<style scoped></style>
