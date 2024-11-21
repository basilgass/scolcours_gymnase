<script
	lang="ts"
	setup
>
import type { ChapterShowInterface, PostInterface } from "@/types/modelInterfaces"
import { usePage } from "@inertiajs/vue3"
import { computed } from "vue"

const props = defineProps<{
	chapter: ChapterShowInterface, // slug, title, posts.length
	posts: PostInterface[],
	currentPost: number
}>()

const nav = computed<{
	previous: string | false,
	home: string,
	next: string | false
}>(() => {

	const themeSlug = usePage().props.theme.slug

	const chapterSlug = props.chapter.slug
	const previous = props.currentPost > 1 ?
		route("themes.chapters.slide", [
			themeSlug,
			chapterSlug,
			props.currentPost - 1
		]) : false

	const home = route("themes.chapters.intro", [
		themeSlug,
		chapterSlug
	])

	const next = props.currentPost < props.posts.length ?
		route("themes.chapters.slide", [
			themeSlug,
			chapterSlug,
			props.currentPost + 1
		]) : false

	return { previous, home, next }
})
</script>

<template>
	<div class="grid grid-cols-3 mt-3 px-5 md:px-0">
		<div class="justify-self-start">
			<InertiaLink
				v-if="nav.previous"
				v-theme.btn
				:href="nav.previous"
			>
				<i class="bi bi-box-arrow-in-left mr-0 md:mr-2" />
				<div class="hidden md:inline">
					précédant
				</div>
			</InertiaLink>
		</div>
		<div class="justify-self-center flex">
			<InertiaLink
				v-theme.btn
				:href="nav.home"
			>
				<i class="bi bi-house mr-2 hidden md:inline" /><span v-katex.auto="chapter.title" />
			</InertiaLink>
		</div>
		<div class="justify-self-end">
			<InertiaLink
				v-if="nav.next"
				v-theme.btn
				:href="nav.next"
			>
				<div class="hidden md:inline">
					suivant
				</div>
				<i class="bi bi-box-arrow-in-right ml-0 md:ml-2" />
			</InertiaLink>
		</div>
	</div>
</template>

<style scoped></style>
