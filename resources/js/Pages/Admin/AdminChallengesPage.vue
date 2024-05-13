<script lang="ts" setup>
import { useForm } from "@inertiajs/vue3"
import { computed, PropType, ref } from "vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import type { ChallengeInterface } from "@/types/modelInterfaces"

defineOptions({ layout: LayoutMain })
const props = defineProps({
	challenges: { type: Object as PropType<ChallengeInterface[]>, required: true }
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
	<h1 class="text-3xl pt-5 mb-10">
		Gestion des chapitres, challenges et chapitres
	</h1>

	<article>
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
	</article>
</template>

<style scoped></style>
