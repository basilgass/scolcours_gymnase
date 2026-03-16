<script setup lang="ts">

import LessonCard from "@/Components/Courses/LessonCard.vue"
import {CourseInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import dayjs from "dayjs"
import {LessonScoreRulesInterface} from "@/types/lessonInterfaces.ts"
import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"

const editMode = useStoreEditMode()

const props = defineProps<{
	course: CourseInterface
	team: TeamInterface
	day: string,
	lessons: Record<string, LessonInterface<LessonScoreRulesInterface>[]>
}>()

function afficherDate(day: string): string {
	return day === 'non planifié'
		? day
		: dayjs(day).format('DD MMMM YYYY')
}

const showDetails = ref(false)
</script>

<template>
	<card>
		<template #header>
			<h3
				class="text-lg font-semibold my-3"
			>
				{{ afficherDate(day) }}
			</h3>
		</template>

		<div
			class="font-code cursor-pointer"
			@click="showDetails=!showDetails"
		>
			<i
				class="bi inline-block text-xs transition-all"
				:class="{
					'bi-triangle rotate-90': !showDetails,
					'bi-triangle-fill rotate-180': showDetails
				}"
			/> {{ lessons[day].length }} cours
		</div>
		<div
			v-if="showDetails"
			class="mt-3 grid grid-cols-1 gap-3"
		>
			<lesson-card
				v-for="lesson in lessons[day]"
				:key="`lesson-${lesson.id}`"
				:course
				:lesson
				:team
			/>
		</div>
	</card>
</template>
