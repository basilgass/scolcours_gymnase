<script setup lang="ts">

import {CourseInterface, LessonInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import dayjs from "dayjs"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

const props = defineProps<{
	course: CourseInterface
	lesson: LessonInterface
}>()

const scoreStore = useStoreScore()
const score = ref<ScoreInterface>(null)
const isPast = computed(() => {
	return score.value && !isDone.value && props.lesson.scheduled_at
		? dayjs(props.lesson.scheduled_at).isBefore(dayjs())
		: false
})

const isDone = computed(() => {
	return !!score.value?.is_resolved
})

const tooltip = ref(false)
onMounted(() => {
	scoreStore
		.getScore('Lesson', props.lesson.id)
		.then(res => score.value = res)
})

</script>

<template>
	<InertiaLink
		as="div"
		:href="route('students.lessons.show', {course: course.slug, lesson: lesson.id})"
		class="relative w-8 h-8 rounded-full cursor-pointer grid place-items-center border"
		:class="{
			'bg-green-100 text-green-600 border-green-300': isDone,
			'bg-red-100 text-red-600 border-red-300':isPast,
			'bg-blue-100 text-blue-600 border-blue-300': !isPast && !isDone
		}"
		@mouseenter="tooltip=true"
		@mouseleave="tooltip=false"
	>
		<lesson-type-icon :lesson />

		<transition name="fade">
			<div
				v-show="tooltip"
				class="absolute
					-top-12 px-3 py-2
					text-center
					whitespace-nowrap overflow-hidden
					bg-content border shadow
					"
				v-katex.auto="lesson.title"
			/>
		</transition>
	</InertiaLink>
</template>

<style scoped>

</style>
