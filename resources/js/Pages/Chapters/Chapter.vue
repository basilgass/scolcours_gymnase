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
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
			<div
					v-for="(exercise, index) of chapter.exercises"
					:key="`exercise-${exercise.id}`"
				>
				<Exercise
						:exercise="exercise"
						:exercise-number="index+1"
					/>
			</div>
		</div>
	</div>
</template>

<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>
<script setup>
import { computed, defineAsyncComponent } from 'vue'
import Exercise from '@/Components/Ui/Exercise'

const props = defineProps({
	theme: {type: Object, default: ()=>{}},
	chapter: {type: Object, default: () => {}},
	hasChapterComponent: {type: Boolean, default: false},
})

const chapterComponent = computed(
	()=> defineAsyncComponent(
		() => import(`@/Components/Chapters/${props.theme.slug}/${props.chapter.slug}`)
	)
)

</script>

