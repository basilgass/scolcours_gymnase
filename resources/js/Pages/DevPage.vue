<template>
	<h1 class="text-3xl pt-5 mb-10">
		Exercices
	</h1>

	<section
		v-if="exercises.length>0"
		class="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-10"
	>
		<ExerciseShow
			v-for="exercise in exercises"
			:key="exercise.id"
			:exercise="exercise"
		/>
	</section>
</template>

<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}
</script>
<script setup>
import ExerciseShow from "@/Components/Posts/ExerciseShow"

let props = defineProps({
	exercises: {type: Array, default: () => []}
})
</script>
