<script setup lang="ts">
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {lessonableClassName} from "@/types/lessonInterfaces.ts"

const icons: Record<lessonableClassName, string> = {
	'Post': 'théorie ou exercices',
	'Challenge': 'challenge',
	'Generator': 'entraînement',
	'Deck': 'deck de cartes'
}
</script>

<template>
	<div class="flex gap-8">
		<div
			v-for="(description, key) in icons"
			:key="key"
		>
			<lesson-type-icon :lesson="{lessonable_type: key}" /> {{ description }}
		</div>
	</div>
</template>

<style scoped>

</style>
