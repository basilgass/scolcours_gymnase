<script setup lang="ts">
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {lessonableClassName, lessonIconsColors} from "@/types/lessonInterfaces.ts"

const icons: Record<lessonableClassName, string> = {
	'Post': 'théorie ou exercices',
	'Challenge': 'challenge',
	'Generator': 'entraînement',
	'Deck': 'deck de cartes'
}

const dropLabels: Record<'done' | 'past' | 'empty', string> = {
	done: 'terminé',
	past: 'en retard',
	empty: 'en cours'
}
</script>

<template>
	<div class="space-y-3">
		<div class="flex justify-center gap-8">
			<div
				v-for="(description, key) in icons"
				:key="key"
			>
				<lesson-type-icon :lesson="{lessonable_type: key}" />
				{{ description }}
			</div>
		</div>
		<div class="flex justify-center gap-8">
			<div
				v-for="(label, key) in dropLabels"
				:key="key"
				class="flex gap-3 items-center"
			>
				<div
					class="w-4 h-4 rounded-full border"
					:class="lessonIconsColors[key]"
				/>
				<div
					class="whitespace-nowrap overflow-hidden"
				>
					{{ label }}
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
