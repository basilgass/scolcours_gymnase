<script lang="ts" setup>
import { computed, PropType } from "vue"
import { usePage } from "@inertiajs/vue3"
import type { ChapterInterface } from "@/types/modelInterfaces"

const props = defineProps({
	chapter: {
		type: Object as PropType<ChapterInterface>,
		required: true
	},
	currentPost: {
		type: Number,
		default: null
	}
})

const nav = computed(() => {

	const previous = props.currentPost === 1 ?
		route("themes.chapters.intro", [usePage().props.theme.slug, props.chapter.slug]) :
		route("themes.chapters.slide", [
			usePage().props.theme.slug,
			props.chapter.slug,
			props.currentPost - 1
		])

	const next = props.currentPost === props.chapter.posts.length ?
		null :
		route("themes.chapters.slide", [
			usePage().props.theme.slug,
			props.chapter.slug,
			props.currentPost + 1
		])

	return { previous, next }
})
</script>

<template>
	<div class="grid grid-cols-3 mt-3 px-5 md:px-0">
		<div class="justify-self-start">
			<Link
				v-if="nav.previous"
				:class="`btn-scolcours-${$page.props.theme.slug}`"
				:href="nav.previous"
			>
				<i class="bi bi-box-arrow-in-left mr-0 md:mr-2" />
				<div class="hidden md:inline">
					précédant
				</div>
			</Link>
		</div>
		<div class="justify-self-center flex">
			<Link
				:class="`btn-scolcours-${$page.props.theme.slug}`"
				:href="
					route('themes.chapters.intro', [
						$page.props.theme.slug,
						chapter.slug,
					])
				"
			>
				<i class="bi bi-house mr-2 hidden md:inline" /><span
					v-katex.auto="chapter.title"
				/>
			</Link>
		</div>
		<div class="justify-self-end">
			<Link
				v-if="nav.next"
				:class="`btn-scolcours-${$page.props.theme.slug}`"
				:href="nav.next"
			>
				<div class="hidden md:inline">
					suivant
				</div>
				<i class="bi bi-box-arrow-in-right ml-0 md:ml-2" />
			</Link>
		</div>
	</div>
</template>

<style scoped>

</style>
