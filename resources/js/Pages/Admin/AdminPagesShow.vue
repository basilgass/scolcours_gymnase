<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
		layout: LayoutMain,
	}
</script>

<script setup>
	import Panel from "@/Components/Ui/Panel.vue"
	import { useForm } from "@inertiajs/vue3"
	import { computed, ref } from "vue"
	import FormMaker from "@/Components/Form/FormMaker.vue"

	const props = defineProps({
		tools: Object,
		chapters: Object,
		challenges: Object,
	})

	let filterChapter = ref("")

	const Form = useForm({
		slug: "",
		active: false,
	})

	let chapterCurrentTheme = ref("")
	let chapterThemes = computed(() => {
		let themes = props.chapters.map((chapter) => chapter.theme)
		themes.sort()
		return [...new Set(themes)]
	})

	let filtreredChapters = computed(() => {
		let chapters = props.chapters.filter(
			(chapter) =>
				chapter.theme === chapterCurrentTheme.value ||
				chapterCurrentTheme.value === "",
		)
		if (filterChapter.value !== "") {
			chapters = chapters.filter(
				(chapter) =>
					chapter.slug.includes(filterChapter.value) ||
					chapter.title.includes(filterChapter.value),
			)
		}

		return chapters
	})

	//TODO : add a please wait...
	function toggleChapterVisibility(slug, active) {
		Form.slug = slug
		Form.active = active
		Form.patch(`/admin/chapters/${slug}`, {
			preserveScroll: true,
			onSuccess: {},
		})
	}
</script>
<template>
	<h1 class="text-3xl pt-5 mb-10">
		Gestion des chapitres, challenges et chapitres
	</h1>

	<div class="space-y-4">
		<Panel>
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
					class="btn btn-xs"
					:class="chapterCurrentTheme === '' ? 'btn-success' : ''"
					@click="chapterCurrentTheme = ''"
				>
					Tous
				</button>
				<button
					v-for="(theme, id) of chapterThemes"
					:key="id"
					class="btn btn-xs"
					:class="chapterCurrentTheme === theme ? 'btn-success' : ''"
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
							class="btn btn-xs w-full text-white hover:text-gray-800"
							:class="{
								'bg-green-600': chapter.active,
								'bg-red-600': !chapter.active,
							}"
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
		</Panel>

		<Panel>
			<h2 class="text-lg my-2">
				Challenges
			</h2>
			<div class="w-full">
				<div
					v-for="challenge in challenges"
					:key="challenge.slug"
					class="hover:bg-gray-200 flex justify-between px-4 py-2"
				>
					<div>
						<Link
							:href="route('challenges.show', [challenge.slug])"
							class="text-lg leading-6 font-medium text-gray-900"
						>
							{{ challenge.title }}
						</Link>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ challenge.slug }}
						</p>
					</div>
					<div>
						<div>{{ challenge.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</div>
		</Panel>

		<Panel>
			<h2 class="text-lg my-2">
				Outils
			</h2>
			<div class="w-full">
				<div
					v-for="tool in tools"
					:key="tool.slug"
					class="hover:bg-gray-200 flex justify-between px-4 py-2"
				>
					<div>
						<h3 class="text-lg leading-6 font-medium text-gray-900">
							{{ tool.title }}
						</h3>
						<p class="mt-1 max-w-2xl text-sm text-gray-500">
							{{ tool.slug }}
						</p>
					</div>
					<div>
						<div>{{ tool.updated_at }}</div>
						<div>Is activated</div>
					</div>
				</div>
			</div>
		</Panel>
	</div>
</template>

<style scoped></style>
