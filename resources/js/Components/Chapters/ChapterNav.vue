<script
	lang="ts"
	setup
>
import type {ChapterShowInterface, PostInterface} from "@/types/modelInterfaces"
import {usePage} from "@inertiajs/vue3"
import {computed} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<{
	chapter: ChapterShowInterface, // slug, title, posts.length
	posts: PostInterface[],
	currentPostId: number
}>()

const nav = computed<{
	previous: string | false,
	home: string,
	next: string | false
}>(() => {

	// Le theme en cours
	const themeSlug = usePage().props.theme.slug

	// Le chapitre en cours
	const chapterSlug = props.chapter.slug

	// currentPost order
	const currentPostIndex: number = props.posts
		.findIndex(post => post.id === props.currentPostId)

	// On récupère la page précédant.
	const previous = props.posts[currentPostIndex].order > 1 ?
		route("posts.show", [props.posts[currentPostIndex-1].id]) : false

	const home = route("themes.chapters.show", [
		themeSlug,
		chapterSlug
	])

	const next = props.posts[currentPostIndex].order < props.posts.length ?
		route("posts.show", [props.posts[currentPostIndex+1].id]) : false

	return {previous, home, next}
})
</script>

<template>
	<div class="grid grid-cols-2 gap-3 md:gap-1 md:grid-cols-3 mt-3 px-5 md:px-0">
		<div class="order-2 md:order-1 justify-self-start">
			<sc-button
				v-if="nav.previous"
				theme
				:href="nav.previous"
			>
				<i class="bi bi-box-arrow-in-left mr-0 md:mr-2" />
				<div class="hidden md:inline">
					précédant
				</div>
			</sc-button>
		</div>
		<div class="order-1 col-span-2 md:order-2 md:col-span-1 justify-self-center flex w-full">
			<sc-button
				class="w-full"
				theme
				:href="nav.home"
			>
				<i class="bi bi-house mr-2 hidden md:inline" /><span v-katex.auto="chapter.title" />
			</sc-button>
		</div>
		<div class="order-3 justify-self-end">
			<sc-button
				v-if="nav.next"
				theme
				:href="nav.next"
			>
				<div class="hidden md:inline">
					suivant
				</div>
				<i class="bi bi-box-arrow-in-right ml-0 md:ml-2" />
			</sc-button>
		</div>
	</div>
</template>
