<script lang="ts" setup>

import {CourseInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import LessonDrop from "@/Components/Courses/LessonDrop.vue"
import {computed} from "vue"
import dayjs from "dayjs"

const props = defineProps<{
	course: CourseInterface,
	team: TeamInterface,
	lessons: LessonInterface[]
}>()

function toMinutes(time: string): number {
	const [hour, minute] = time.split(':').map(Number)

	if (minute === undefined) {
		return null
	}

	return hour * 60 + minute
}

const firstTimeOfTheDayInMinutes = computed(() => {
	if (props.lessons.length === 0) {
		return null
	}

	const day = dayjs(props.lessons[0].scheduled_at).day()
	const times: number[] = props.team.calendar
		.filter((calendar) => calendar.day === day)
		.map((calendar) => toMinutes(calendar.time))
		.filter(time => time !== null)

	if (times.length === 0) {
		return null
	}

	return Math.min(...times)
})

const homeworkLessons = computed(() => {
	return props.lessons.filter(lesson => lesson.homework)
})

const courseLessons = computed(() => {
	return props.lessons.filter(lesson => !lesson.homework)
})

</script>

<template>
	<div class="space-y-4">
		<div
			v-if="homeworkLessons.length"
			v-theme.bg.light
			class="flex gap-1 flex-col
			-mx-3 -mt-3 p-3 mb-3
			"
		>
			<lesson-drop
				v-for="lesson in homeworkLessons"
				:key="`lesson-tag-${lesson.id}`"
				:course
				:lesson
			/>
		</div>

		<div
			v-if="courseLessons.length"
			class="flex gap-1 flex-col"
		>
			<lesson-drop
				v-for="lesson in courseLessons"
				:key="`lesson-tag-${lesson.id}`"
				:course
				:lesson
			/>
		</div>
	</div>
</template>

<style scoped>

</style>
