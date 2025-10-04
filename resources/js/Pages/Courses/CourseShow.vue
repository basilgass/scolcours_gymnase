<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {
	CourseInterface,
	LessonInterface,
	ScoreInterface,
	UserInterface,
	UserTeamInterface
} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {computed, onMounted, ref} from "vue"
import LessonIconLegend from "@/Components/Courses/LessonIconLegend.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import dayjs from "dayjs"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import StatBar from "@/Components/Ui/StatBar.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import LessonByDates from "@/Components/Courses/LessonByDates.vue"
import Card from "@/Components/Ui/Card.vue"
import LessonDrops from "@/Components/Courses/LessonDrops.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {lessonIconsColors} from "@/types/lessonInterfaces.ts"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

const props = defineProps<{
	course: CourseInterface,
	team: UserTeamInterface
}>()

// Load all scores for these lessons.
const scoreStore = useStoreScore()
const scores = ref<Record<number, ScoreInterface<ScoreLessonDataInterface>>>({})
scoreStore
	.getScores(
		"Lesson",
		props.course.lessons.map(lesson => lesson.id)
	)
	.then((res: ScoreInterface<ScoreLessonDataInterface>[]) => {
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
const futurDate = computed(() => {
	return orderedDate.value.filter(day => day !== UNPLANNED && dayjs(day).isAfter(dayjs(), 'day'))
})
const thisDate = computed(() => {
	const today = dayjs().format("YYYY-MM-DD")

	return orderedDate.value.includes(today) ? today : null
})
const pastDate = computed(() => {
	return orderedDate.value.filter(day => day !== UNPLANNED && dayjs(day).isBefore(dayjs(), 'day'))
})

function afficherDate(day: string, short?: boolean): string {
	return day === UNPLANNED
		? day
		: dayjs(day).format(short ? 'dd DD.MM.YYYY' : 'DD MMMM YYYY')
}

export interface ILessonStats {
	lesson_id: number,
	total_scores: number,
	resolved_scores: number,
	users_id: number[]
}

const lesson_stats = ref<Record<string, ILessonStats>>({})
const users = ref<UserInterface[]>([])
const selected_user_id = ref(0)

const selected_user_stats = computed<Record<string, ILessonStats>>(() => {
	if (!lesson_stats.value) {
		return {}
	}

	if (selected_user_id.value === 0) {
		return lesson_stats.value
	}


	const userStats: Record<string, ILessonStats> = {}
	for (let id in lesson_stats.value) {
		userStats[id] = {
			users_id: [],
			lesson_id: +id,
			resolved_scores: lesson_stats.value[+id].users_id.includes(selected_user_id.value) ? 1 : 0,
			total_scores: 1
		}
	}

	return userStats
})

function loadStats() {
	axios.get(route('api.admin.teams.users', {team: props.team.id}))
		.then((res: AxiosResponseModel<UserInterface[]>) => {
			users.value = res.data
		})

	axios.get(route('api.admin.courses.teams.stats', {
		team: props.team.id,
		course: props.course.id
	}))
		.then((res: AxiosResponseModel<Record<string, ILessonStats>>) => {
			lesson_stats.value = res.data

			flash.success('Les statistiques ont été mise à jour.')
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

		<div
			v-admin="editMode.enable"
			v-if="lesson_stats && users.length"
			class="my-6"
		>
			<!-- Liste des étudiants -->
			<div
				v-if="editMode.enable && users.length"
				class="flex gap-3 flex-wrap"
			>
				<sc-button
					theme
					:outline="selected_user_id!==0"
					@click="selected_user_id=0"
					xs
				>
					Tous
				</sc-button>
				<sc-button
					v-for="user in users"
					:key="`user-${user.id}`"
					theme
					:outline="selected_user_id!==user.id"
					@click="selected_user_id=user.id"
					xs
				>
					{{ user.fullname }}
				</sc-button>
			</div>

			<div class="flex justify-between items-baseline">
				<h3 class="text-lg uppercase mb-3">
					statistiques de
					{{ selected_user_id === 0 ? team.name : users.find(user => user.id === selected_user_id).fullname }}
				</h3>
				<sc-button
					type="primary"
					outline
					@click="loadStats"
					xs
				>
					<i class="bi bi-arrow-clockwise" /> rafraîchir
				</sc-button>
			</div>
			<div
				v-for="lesson in course.lessons"
				:key="`stats-${lesson.id}`"
				class="flex gap-3"
			>
				<div class="flex gap-2">
					<lesson-type-icon
						:lesson
						xs
					/>
					<div
						class="text-xs w-[300px] whitespace-nowrap overflow-hidden"
						v-katex.auto="lesson.title"
					/>
				</div>
				<stat-bar
					class="text-[0.6rem]"
					:max="100"
					:value="selected_user_stats[lesson.id]?.total_scores === 0 ? 0 : (selected_user_stats[lesson.id]?.resolved_scores)/(selected_user_stats[lesson.id]?.total_scores)*100"
				>
					<template #bar>
						{{ selected_user_stats[lesson.id]?.resolved_scores }} /
						{{ selected_user_stats[lesson.id]?.total_scores }}
					</template>
				</stat-bar>
			</div>
		</div>

		<div class="columns-1 md:columns-2 xl:columns-4 space-y-5">
			<card
				v-for="day in orderedDate"
				:key="`lesson-day-tag-${day}`"
				v-show="day!==UNPLANNED"
				:theme="day===thisDate"
			>
				<template #header>
					<h3
						class="font-semibold cursor-pointer"
						@click="useMenuScrollToData('key', `lesson-day-${day}`)"
					>
						{{ afficherDate(day, true) }}
					</h3>
				</template>
				<lesson-drops
					:course
					:lessons="lessonsByDate[day]"
					:team
				/>
			</card>
		</div>

		<div class="flex justify-center mt-12">
			<div
				v-theme.bg.light
				class="p-3 rounded-lg"
			>
				<i class="bi bi-exclamation-triangle text-xl mr-3" />Les leçons dans l'encadré de couleur sont en
				devoirs, à faire <span class="font-semibold">avant</span> le cours !
			</div>
		</div>

		<lesson-icon-legend class="mt-5" />
	</section>
</template>

