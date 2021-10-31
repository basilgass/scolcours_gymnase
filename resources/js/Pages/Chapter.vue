<template>
	<!-- Title -->
	<h1 class="text-3xl mb-1">
		{{ chapter.title }}
	</h1>

	<!-- Chapter description -->
	<div class="mb-5">
		{{ chapter.body }}
	</div>

	<!-- Chapter component with or without interactivity -->
	<component :is="chapterComponent" />

	<!-- exercises -->
	<div v-if="chapter.exercises.length>0">
		<h2 class="my-4 font-semibold text-lg">
			Exercices
		</h2>
		<div class="space-y-5">
			<div
					v-for="exercise in chapter.exercises"
					:key="`exercise-${exercise.id}`"
				>
				<Exercise :exercise="exercise" />
			</div>
		</div>
	</div>
</template>
<script>
	import Layout from "@/Pages/Layout"
	import {defineAsyncComponent} from "vue"
	import Exercise from "@/Components/Exercise/Exercise"

	export default {
		name: "Chapter",
		components: {Exercise},
		layout: Layout,
		props: {
			chapter: {
				type: Object, default: () => {}
			},
			hasChapterComponent: {type: Boolean, default: false},
		},
		computed: {
			chapterComponent() {
				if (this.hasChapterComponent) {
					return defineAsyncComponent(() => import(`@/Chapters/${this.$page.props.theme.slug}/${this.chapter.slug}`))
				}
			}
		}
	}
</script>

