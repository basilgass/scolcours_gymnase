<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import {CourseInterface, LessonInterface, ScoreInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import {computed, inject, onMounted, ref} from "vue"
import dayjs from "dayjs"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {AxiosErrorMessage, flashInterface} from "@/types"
import LessonTeamCalendar from "@/Pages/Courses/LessonTeamCalendar.vue"
import {router} from "@inertiajs/vue3"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

const props = defineProps<{
	course: CourseInterface
	lesson: LessonInterface,
	team: UserTeamInterface
}>()

const editMode = useStoreEditMode()
const flash = inject<flashInterface>('flash')

const scoreStore = useStoreScore()
const score = ref<ScoreInterface>(null)
const isPast = computed(() => {
	return score.value && !isDone.value && props.lesson.scheduled_at
		? dayjs(props.lesson.scheduled_at).isBefore(dayjs())
		: false
})

const scheduled_at = ref(
	props.lesson.scheduled_at
		? dayjs(props.lesson.scheduled_at).format('YYYY-MM-DDTHH:mm')
		: ""
)


function updateLesson(value?: string) {
	if (value) {
		scheduled_at.value = value
	}

	axios
		.patch(route('api.admin.teams.lessons.update', {
			lesson: props.lesson.id,
			team: props.team.id,
		}), {
			scheduled_at: scheduled_at.value,
		})
		.then(() => {
			flash.success('La leçon a bien été mise à jour.')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

function cardClick() {
	router.visit(
		route('students.lessons.show',
			{
				course: props.course.slug,
				lesson: props.lesson.id
			}
		)
	)
}

const isDone = computed(() => {
	return score.value?.is_resolved ?? false
})

onMounted(() => {
	scoreStore
		.getScore('Lesson', props.lesson.id)
		.then(res => score.value = res)
})
</script>

<template>
	<Card
		class="hover:shadow hover:scale-101 transition-all"
		:success="isDone"
		:error="isPast"
	>
		<div
			class="flex justify-between py-5 cursor-pointer"
			@click="cardClick"
		>
			<div class="flex gap-3 items-baseline">
				<lesson-type-icon
					:lesson
					xl
				/>
				<h3
					v-katex.auto="lesson.title"
					class="text-lg md:text-xl"
				/>
			</div>
			<div>
				<sc-button
					xs
					type="primary"
					outline
				>
					<i class="px-4 text-lg -my-1 bi bi-arrow-right" />
				</sc-button>
			</div>
		</div>
		<template #footer>
			<div
				v-show="score"
				class="flex justify-between text-xs text-slate-500 py-1"
			>
				<div>
					La leçon {{ isPast ? 'était' : 'est' }} à terminer {{ lesson.remaining_time }}
				</div>
				<div>
					<span v-if="lesson.scheduled_at">
						{{ dayjs(lesson.scheduled_at).format('DD MMMM YYYY, [à] HH[h]mm') }}
					</span>
					<span v-else>
						non planifié
					</span>
				</div>
			</div>

			<div
				v-theme.admin
				class="-mx-3 p-3"
				v-admin="editMode.enable"
			>
				<div>
					modifier la date pour la leçon {{ lesson.id }}, l'équipe {{ team.name }} (id: {{ team.id }}})
					<form-maker
						type="datetime-local"
						v-model="scheduled_at"
						btn
						@button="updateLesson"
					/>
				</div>

				<div>
					<lesson-team-calendar
						:calendar="team.calendar"
						@button-click="updateLesson($event)"
						:n="4"
					/>
				</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
