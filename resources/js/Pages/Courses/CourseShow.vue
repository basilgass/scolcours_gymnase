<script setup lang="ts">

import LayoutMain from "@/Layouts/LayoutMain.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {CourseInterface, LessonInterface, UserInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import AdminHeader from "@/Components/Admin/AdminHeader.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {computed, inject, onMounted, ref} from "vue"
import LessonCard from "@/Pages/Courses/LessonCard.vue"
import LessonIconLegend from "@/Pages/Courses/LessonIconLegend.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import dayjs from "dayjs"
import {useMenuScrollToData} from "@/Composables/useHelpers.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import StatBar from "@/Components/Ui/StatBar.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"

defineOptions({layout: LayoutMain})

const editMode = useStoreEditMode()
const flash = inject<flashInterface>('flash')

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

const hidePastDate = ref(true)
const lessonsByDate = computed<Record<string, LessonInterface[]>>(() => {
	const grouped: Record<string, LessonInterface[]> = {}


	props.course.lessons.forEach(lesson => {
		if (lesson.scheduled_at) {
			const d = dayjs(lesson.scheduled_at)
			if(!hidePastDate.value || d.isAfter(dayjs().subtract(1, 'day'), 'day')){
				const dateStr = d.format("YYYY-MM-DD")

				if (!grouped[dateStr]) grouped[dateStr] = []
				grouped[dateStr].push(lesson)
			}
		}
	})

	grouped['non planifié'] = props.course.lessons.filter(lesson => !lesson.scheduled_at)

	return grouped
})

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
					class="text-xs"
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


		<div class="flex flex-col gap-10">
			<div class="flex gap-3">
				<sc-button @click="hidePastDate = !hidePastDate">
					<i
						:class="{
							'bi-eye-slash': !hidePastDate,
							'bi-eye': hidePastDate
						}"
					/> {{ hidePastDate ? 'afficher': 'cacher' }} les leçons passées
				</sc-button>
			</div>


			<!-- Liste des dates du cours. -->
			<div class="flex gap-3">
				<h3>dates planifiées </h3>
				<div
					v-for="(_, day) in lessonsByDate"
					:key="`btn-${day}`"
				>
					<sc-button
						xs
						@click="useMenuScrollToData('key', `lesson-day-${day}`)"
					>
						{{ dayjs(day).format('DD MMMM YYYY') }}
					</sc-button>
				</div>
			</div>


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
						:stats="lesson_stats?.[lesson.id]"
					/>
				</div>
			</div>
		</div>

		<lesson-icon-legend class="justify-center mt-24" />
	</section>
</template>

