<script lang="ts" setup>

import {CourseInterface, LessonInterface} from "@/types/modelInterfaces.ts"
import LessonDrop from "@/Components/Courses/LessonDrop.vue"
import {computed} from "vue"
import {lessonBandColors} from "@/types/lessonInterfaces.ts"

const props = defineProps<{
	course: CourseInterface,
	lessons: LessonInterface[]
}>()

const homeworkLessons = computed(() => {
	return props.lessons.filter(lesson => lesson.homework && !lesson.deadline)
})

const courseLessons = computed(() => {
	return props.lessons.filter(lesson => !lesson.homework && !lesson.deadline)
})

const deadlineLessons = computed(() => {
	return props.lessons.filter(lesson => lesson.deadline)
})

</script>

<template>
	<div class="space-y-4">
		<div
			v-if="homeworkLessons.length"
			class="flex gap-1 flex-col border p-2 rounded-lg"
			:class="lessonBandColors.homework.base"
		>
			<div
				class="text-xs font-semibold uppercase"
				:class="lessonBandColors.homework.text"
			>
				Devoirs
			</div>
			<lesson-drop
				v-for="lesson in homeworkLessons"
				:key="`lesson-tag-${lesson.id}`"
				:course
				:lesson
			/>
		</div>

		<div
			v-if="courseLessons.length"
			class="flex gap-1 flex-col border border-transparent p-2 rounded-lg"
		>
			<lesson-drop
				v-for="lesson in courseLessons"
				:key="`lesson-tag-${lesson.id}`"
				:course
				:lesson
			/>
		</div>

		<div
			v-if="deadlineLessons.length"
			class="flex gap-1 flex-col border p-2 rounded-lg"
			:class="lessonBandColors.deadline.base"
		>
			<div
				class="text-xs font-semibold uppercase"
				:class="lessonBandColors.deadline.text"
			>
				Échéance
			</div>
			<lesson-drop
				v-for="lesson in deadlineLessons"
				:key="`lesson-tag-${lesson.id}`"
				:course
				:lesson
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
