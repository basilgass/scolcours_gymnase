<script lang="ts" setup>

import StatBar from "@/Components/Ui/StatBar.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {computed, onMounted, onUnmounted, ref} from "vue"
import {CourseInterface, ScoreInterface, TeamInterface, UserInterface} from "@/types/modelInterfaces.ts"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import dayjs from "dayjs"
import {lessonableClassName} from "@/types/lessonInterfaces.ts"

const props = defineProps<{
	course: CourseInterface,
	team: TeamInterface
}>()

const availableFilters = computed(() => {
	const filterValues: lessonableClassName[] = ['Post', 'Generator', 'Challenge', 'Deck']

	const arr = []

	filterValues.forEach((f) => {
		if (props.course.lessons.some(lesson => lesson.lessonable_type === f)) {
			arr.push(f)
		}
	})

	return arr
})
const filter = ref<lessonableClassName | null>(null)
const lessons = computed(() => {
	if (filter.value === null) return props.course.lessons

	return props.course.lessons.filter(lesson => lesson.lessonable_type === filter.value)
})

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

export interface ILessonStats {
	lesson_id: number,
	resolved_scores: number,
	total_scores: number,
	users_id: number[]
}

const lesson_stats = ref<Record<string, ILessonStats>>({})
const users = ref<UserInterface[]>([])
const selected_user_id = ref(0)
const showUserStats = ref<boolean>(false)

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
	axios.get(route('api.admin.courses.teams.stats', {
		team: props.team.id,
		course: props.course.id
	}))
		.then((res: AxiosResponseModel<Record<string, ILessonStats>>) => {
			lesson_stats.value = res.data
			// flash.success('Les statistiques ont été mise à jour.')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
		.finally(() => {
			lastUpdate.value = `mise à jour à ${dayjs().format('HH:mm:ss')}`
		})
}

const stats_per_user = computed<Record<number, number>>(() => {
	const dict: Record<number, number> = {}
	users.value.forEach(user => {
		if (!dict[user.id]) dict[user.id] = 0

		Object.values(lesson_stats.value).forEach(stat => {
			dict[user.id] += stat.users_id.includes(user.id) ? 1 : 0
		})

	})

	return dict
})

let intervalID: number
const interval = 1 * 60 * 1000
const lastUpdate = ref<string>('en attente de mise à jour.')
onMounted(() => {
	axios.get(route('api.admin.teams.users', {team: props.team.id}))
		.then((res: AxiosResponseModel<UserInterface[]>) => {
			users.value = res.data

			loadStats()
		}).finally(() => {
		intervalID = setInterval(loadStats, interval)
	})


})

onUnmounted(() => {
	clearInterval(intervalID)
})
</script>

<template>
	<div
		v-if="lesson_stats && users.length"
		class="space-y-3"
	>
		<!-- en-tête et titres -->
		<div class="flex justify-between items-baseline">
			<div class="flex items-baseline gap-3">
				<h3 class="text-lg uppercase">
					statistiques de
					{{ selected_user_id === 0 ? team.name : users.find(user => user.id === selected_user_id).fullname }}
				</h3>
				<div class="flex gap-2 text-xs">
					<lesson-type-icon
						v-for="t in availableFilters"
						:key="`filter-${t}`"
						:class="{
							'opacity-30': filter!==null && filter!==t
						}"
						:lesson="t"
						@click="filter=filter === t ? null : t"
					/>
				</div>
			</div>


			<div class="flex gap-3">
				<div @click="showUserStats=!showUserStats">
					<i class="bi bi-bar-chart"></i>
				</div>
				<sc-button
					outline
					type="primary"
					xs
					@click="loadStats"
				>
					<i class="bi bi-arrow-clockwise" /> {{ lastUpdate }}
				</sc-button>

			</div>
		</div>

		<!-- Liste des étudiants -->
		<div
			v-if="users.length"
			class="flex gap-3 flex-wrap"
		>
			<sc-button
				:outline="selected_user_id!==0"
				theme
				xs
				@click="selected_user_id=0"
			>
				Tous <span v-if="showUserStats">{{ Object.keys(lesson_stats).length }}</span>
			</sc-button>
			<sc-button
				v-for="user in users"
				:key="`user-${user.id}`"
				:outline="selected_user_id!==user.id"
				theme
				xs
				@click="selected_user_id=user.id"
			>
				{{ user.fullname }} <span v-if="showUserStats">{{ stats_per_user[user.id] }}</span>
			</sc-button>
		</div>

		<!-- barres  -->
		<div>
			<div
				v-for="lesson in lessons"
				:key="`stats-${lesson.id}`"
				class="grid auto-cols-min grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
			>
				<div
					class="flex gap-2 cursor-pointer hover:font-semibold min-w-75"
					@click="router.visit(route('admin.courses.lessons.show', {course: course.slug, team: team.name, lesson: lesson.id }))"
				>
					<lesson-type-icon
						:lesson
						xs
					/>
					<div
						v-katex.auto="lesson.title"
						class="text-xs whitespace-nowrap overflow-hidden"
					/>
				</div>
				<stat-bar
					:max="100"
					:value="selected_user_stats[lesson.id]?.total_scores === 0 ? 0 : (selected_user_stats[lesson.id]?.resolved_scores)/(selected_user_stats[lesson.id]?.total_scores)*100"
					class="text-[0.6rem] col-span-1 lg:col-span-2"
				>
					<template #bar>
						{{ selected_user_stats[lesson.id]?.resolved_scores }} /
						{{ selected_user_stats[lesson.id]?.total_scores }}
					</template>
				</stat-bar>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
