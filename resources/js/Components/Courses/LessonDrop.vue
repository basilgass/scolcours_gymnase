<script setup lang="ts">

import {CourseInterface, LessonInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import dayjs from "dayjs"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {lessonIconsColors} from "@/types/lessonInterfaces.ts"

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

const dropColorClass = computed(()=>{
	if(isDone.value){return lessonIconsColors.done}

	if(isPast.value){return lessonIconsColors.past}

	return lessonIconsColors.empty
})

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
		class="cursor-pointer hover:pl-1 transition-all"
	>
		<div class="flex gap-3">
			<div
				class="relative w-8 h-8 rounded-full grid place-items-center border"
				:class="dropColorClass"
			>
				<lesson-type-icon :lesson />
			</div>
			<div
				v-katex.auto="lesson.title"
				class="whitespace-nowrap overflow-hidden"
			/>
		</div>
	</InertiaLink>
</template>

<style scoped>

</style>
