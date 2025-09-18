<script setup lang="ts">

import LessonCard from "@/Components/Courses/LessonCard.vue"
import {CourseInterface, LessonInterface, TeamInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import dayjs from "dayjs"
import {LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"

const editMode = useStoreEditMode()

const props = defineProps<{
	course: CourseInterface
	team: UserTeamInterface
	dates: string[],
	lessons: Record<string, LessonInterface<LessonScoreRulesInterface>[]>
}>()

function afficherDate(day: string): string {
	return day === 'non planifié'
		? day
		: dayjs(day).format('DD MMMM YYYY')
}
</script>

<template>
	<div class="flex flex-col gap-10">
		<div
			v-for="day in dates"
			:key="`lesson-day-${day}`"
			:data-key="`lesson-day-${day}`"
		>
			<h3 class="text-lg my-3">
				{{ afficherDate(day) }}
			</h3>
			<div
				:class="{
					'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3': !editMode.enable,
					'grid grid-cols-1 gap-3': editMode.enable,
				}"
			>
				<lesson-card
					v-for="lesson in lessons[day]"
					:key="`lesson-${lesson.id}`"
					:course
					:lesson
					:team
				/>
			</div>
		</div>
	</div>
</template>
