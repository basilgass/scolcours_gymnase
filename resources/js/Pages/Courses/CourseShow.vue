<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface, ScoreInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {computed, ref} from "vue"
import LessonIconLegend from "@/Components/Courses/LessonIconLegend.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import dayjs from "dayjs"
import {useScrollTo} from "@/Composables/useHelpers.ts"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import LessonDrops from "@/Components/Courses/LessonDrops.vue"
import {lessonBandColors} from "@/types/lessonInterfaces.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	course: CourseInterface,
	team: TeamInterface
}>()

// Load all scores for these lessons.
const scoreStore = useStoreScore()
const scores = ref<Record<number, ScoreInterface<ScoreLessonDataInterface>>>({})
scoreStore
	.getScores<ScoreLessonDataInterface>(
		"Lesson",
		props.course.lessons.map(lesson => lesson.id)
	)
	.then(res => {
		res.forEach(score => {
			scores.value[score.scoreable_id] = score
		})
	})

const lessonsByDate = computed<Record<string, LessonInterface[]>>(() => {
	const grouped: Record<string, LessonInterface[]> = {}
	props.course.lessons.forEach(lesson => {
		if (lesson.scheduled_at) {
			const d = dayjs(lesson.scheduled_at)
			const dateStr = d.format("YYYY-MM-DD")

			if (!grouped[dateStr]) grouped[dateStr] = []
			grouped[dateStr].push(lesson)
		}
	})

	const unplanned = props.course.lessons.filter(lesson => !lesson.scheduled_at)

	if (unplanned.length > 0) {
		grouped[UNPLANNED] = unplanned
	}

	return grouped
})

const orderedDate = computed(() => {
	const dates = Object.keys(lessonsByDate.value)
	dates.sort()
	return dates
})

const UNPLANNED = 'non planifié'
const thisDate = computed(() => {
	const today = dayjs().format("YYYY-MM-DD")

	return orderedDate.value.includes(today) ? today : null
})

function afficherDate(day: string, short?: boolean): string {
	return day === UNPLANNED
		? day
		: dayjs(day).format(short ? 'dd DD.MM.YYYY' : 'DD MMMM YYYY')
}

</script>

<template>
	<section>
		<admin-header>
			<sc-button
				type="edit"
				xs
				:href="route('admin.courses.teams.dashboard', {
					course: course.id,
					team: team.name
				})"
			>
				administration des leçons
			</sc-button>

			<sc-button
				type="edit"
				icon
				xs
				:href="route('admin.courses.edit', {course: course.id})"
			>
				éditer le cours
			</sc-button>
		</admin-header>

		<article-title
			:title="course.title"
			theme
			:return-link="{
				label: 'Retour à mes cours',
				url: route('courses.index')
			}"
			class="mb-3"
		/>

		<block-show
			:block="course.block"
			class="mb-10"
		/>

		<div class="columns-1 md:columns-2 xl:columns-4 space-y-5">
			<card
				v-for="day in orderedDate"
				v-show="day!==UNPLANNED"
				:key="`lesson-day-tag-${day}`"
				:theme="day===thisDate"
			>
				<template #header>
					<h3
						class="font-semibold cursor-pointer"
						@click="useScrollTo({key: 'key', value: `lesson-day-${day}`})"
					>
						{{ afficherDate(day, true) }}
					</h3>
				</template>
				<lesson-drops
					:course
					:lessons="lessonsByDate[day]"
				/>
			</card>
		</div>

		<div class="flex justify-center mt-12">
			<div class="p-3 rounded-lg border flex flex-col gap-2 text-sm">
				<div class="flex items-center gap-2">
					<span
						class="inline-block w-4 h-4 rounded border shrink-0"
						:class="lessonBandColors.homework.base"
					/>
					<span>Encadré <span
						class="font-semibold"
						:class="lessonBandColors.homework.text"
					>orange</span> : devoir à faire <span class="font-semibold">avant</span> le cours.</span>
				</div>
				<div class="flex items-center gap-2">
					<span
						class="inline-block w-4 h-4 rounded border shrink-0"
						:class="lessonBandColors.deadline.base"
					/>
					<span>Encadré <span
						class="font-semibold"
						:class="lessonBandColors.deadline.text"
					>vert</span> : échéance à faire pour ce jour (23h59).</span>
				</div>
			</div>
		</div>

		<lesson-icon-legend class="mt-5" />
	</section>
</template>

