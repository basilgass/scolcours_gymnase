<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface, UserInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {computed, onMounted, ref} from "vue"
import LessonCard from "@/Pages/Courses/LessonCard.vue"
import LessonIconLegend from "@/Pages/Courses/LessonIconLegend.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import dayjs from "dayjs"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import Card from "@/Components/Ui/Card.vue"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import BarChart from "@/Components/Charts/barChart.vue"
import StatBar from "@/Components/Ui/StatBar.vue"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()

const props = defineProps<{
	course: CourseInterface,
	team: UserTeamInterface
}>()

// Load all scores for these lessons.
const scoreStore = useStoreScore()
scoreStore.getScores(
	"Lesson",
	props.course.lessons.map(lesson => lesson.id)
)

const lessonsByDate = computed<Record<string, LessonInterface[]>>(() => {
	const grouped: Record<string, LessonInterface[]> = {}

	props.course.lessons.forEach(lesson => {
		if (lesson.scheduled_at) {
			const dateStr = dayjs(lesson.scheduled_at).format("YYYY-MM-DD")
			if (!grouped[dateStr]) grouped[dateStr] = []
			grouped[dateStr].push(lesson)
		}
	})

	return grouped
})

const lessonUnplanned = computed<LessonInterface[]>(() => {
	return props.course.lessons.filter(lesson => !lesson.scheduled_at)
})

export interface ILessonStats {
	lesson_id: number,
	total_scores: number,
	resolved_scores: number,
	users_id: number[]
}

const lesson_stats = ref<Record<string, ILessonStats>>({})
const users = ref<UserInterface[]>([])
function loadStats() {
	axios.get(route('api.admin.teams.users', {team: props.team.id}))
		.then((res: AxiosResponseModel<UserInterface[]>)=>{
			users.value = res.data
		})

	axios.get(route('api.admin.courses.teams.stats', {
		team: props.team.id,
		course: props.course.id
	}))
		.then((res: AxiosResponseModel<Record<string, ILessonStats>>) => {
			lesson_stats.value = res.data
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

function loasStatsLesson(lesson: LessonInterface) {
	// TODO: update des stats pour une leçon uniquement...
	axios.get(route())
		.then(() => {
			// update data.
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

onMounted(() => {
	loadStats()
})
</script>

<template>
	<section>
		<admin-header>
			<sc-button
				type="edit"
				icon
				xs
				:href="route('admin.courses.edit', {course: props.course.slug})"
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

		<!-- Liste des dates du cours. -->
		<div class="flex gap-3">
			<div
				v-for="(_, day) in lessonsByDate"
				:key="`btn-${day}`"
			>
				<sc-button @click="useMenuScrollToData('key', `lesson-day-${day}`)">
					{{ dayjs(day).format('DD MMMM YYYY') }}
				</sc-button>
			</div>
		</div>

		<!-- Liste des étudiants -->
		<div v-if="editMode.enable && users.length">
			<div
				v-for="user in users"
				:key="`user-${user.id}`"
			>
				{{ user.fullname }}
			</div>
		</div>


		<div class="flex flex-col gap-10">
			<div
				v-for="(elements, day) in lessonsByDate"
				:key="`lesson-day-${day}`"
				:data-key="`lesson-day-${day}`"
			>
				<h3 class="text-lg font-semibold my-3">
					{{ dayjs(day).format('DD MMMM YYYY') }}
				</h3>
				<div
					:class="{
						'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3': !editMode.enable,
						'grid grid-cols-1 gap-3': editMode.enable,
					}"
				>
					<lesson-card
						v-for="lesson in elements"
						:key="`lesson-${lesson.id}`"

						:course
						:lesson
						:team
						:stats="lesson_stats[lesson.id]"
					/>
				</div>
			</div>

			<div>
				<h3 class="text-lg font-semibold my-3">
					Non planifié
				</h3>
				<div
					:class="{
						'grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3': !editMode.enable,
						'grid grid-cols-1 gap-3': editMode.enable,
					}"
				>
					<lesson-card
						v-for="lesson in lessonUnplanned"
						:key="`lesson-${lesson.id}`"
						:course
						:lesson
						:team
						:stats="lesson_stats[lesson.id]"
					/>
				</div>
			</div>
		</div>

		<lesson-icon-legend class="justify-center mt-24" />
	</section>
</template>

