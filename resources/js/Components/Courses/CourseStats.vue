<script lang="ts" setup>

import StatBar from "@/Components/Ui/StatBar.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {computed, onMounted, ref} from "vue"
import {CourseInterface, ScoreInterface, TeamInterface, UserInterface} from "@/types/modelInterfaces.ts"
import {ScoreLessonDataInterface} from "@/types/scoreInterfaces.ts"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

const props = defineProps<{
	course: CourseInterface,
	team: TeamInterface
}>()

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
	<div
		v-if="lesson_stats && users.length"
		class="my-6"
	>
		<!-- Liste des étudiants -->
		<div
			v-if="editMode.enable && users.length"
			class="flex gap-3 flex-wrap"
		>
			<sc-button
				:outline="selected_user_id!==0"
				theme
				xs
				@click="selected_user_id=0"
			>
				Tous
			</sc-button>
			<sc-button
				v-for="user in users"
				:key="`user-${user.id}`"
				:outline="selected_user_id!==user.id"
				theme
				xs
				@click="selected_user_id=user.id"
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
				outline
				type="primary"
				xs
				@click="loadStats"
			>
				<i class="bi bi-arrow-clockwise" /> rafraîchir
			</sc-button>
		</div>
		<div
			v-for="lesson in course.lessons"
			:key="`stats-${lesson.id}`"
			class="flex gap-3"
		>
			<div
				class="flex gap-2 cursor-pointer hover:font-semibold"
				@click="router.visit(route('students.lessons.show', {course: course.slug, lesson: lesson.id }))"
			>
				<lesson-type-icon
					:lesson
					xs
				/>
				<div
					v-katex.auto="lesson.title"
					class="text-xs w-[300px] whitespace-nowrap overflow-hidden"
				/>
			</div>
			<stat-bar
				:max="100"
				:value="selected_user_stats[lesson.id]?.total_scores === 0 ? 0 : (selected_user_stats[lesson.id]?.resolved_scores)/(selected_user_stats[lesson.id]?.total_scores)*100"
				class="text-[0.6rem]"
			>
				<template #bar>
					{{ selected_user_stats[lesson.id]?.resolved_scores }} /
					{{ selected_user_stats[lesson.id]?.total_scores }}
				</template>
			</stat-bar>
		</div>
	</div>
</template>

<style scoped>

</style>
