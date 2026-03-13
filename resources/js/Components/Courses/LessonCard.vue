<script lang="ts" setup>

import Card from "@/Components/Ui/Card.vue"
import {CourseInterface, LessonInterface, ScoreInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import {computed, onMounted, ref} from "vue"
import dayjs from "dayjs"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {AxiosErrorMessage} from "@/types"
import LessonTeamCalendar from "@/Pages/Courses/LessonTeamCalendar.vue"
import {router} from "@inertiajs/vue3"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	course: CourseInterface
	lesson: LessonInterface,
	team: UserTeamInterface,
}>()

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

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
		.patch(route('api.admin.teams.lessons.calendars.update', {
			lesson: props.lesson.id,
			team: props.team.id,
		}), {
			scheduled_at: scheduled_at.value,
			homework: false
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
	return !!score.value?.is_resolved
})

onMounted(() => {
	scoreStore
		.getScore('Lesson', props.lesson.id)
		.then(res => score.value = res)
})
</script>

<template>
	<div class="flex gap-5 w-full">
		<Card
			:class="editMode.enable ? 'flex-1/3': 'flex-1'"
			:error="isPast"
			:success="isDone"
			class="hover:shadow hover:scale-101 transition-all"
		>
			<div
				class="flex justify-between cursor-pointer"
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
						outline
						type="primary"
						xs
					>
						<i class="px-4 text-lg -my-1 bi bi-arrow-right" />
					</sc-button>
				</div>
			</div>
		</Card>
		<div
			v-admin="editMode.enable"
			class="flex-2/3 flex flex-col gap-3"
		>
			<Card
				v-admin="editMode.enable"
				v-theme.admin
				class="flex-2/3"
			>
				<div class="flex gap-3 items-top py-3">
					<form-maker
						v-model="scheduled_at"
						btn
						class="max-w-[250px] "
						type="datetime-local"
						@button="updateLesson"
					/>

					<lesson-team-calendar
						:calendar="team.calendar"
						:n="4"
						class="flex-1"
						@button-click="updateLesson($event)"
					/>
				</div>
			</Card>
		</div>
	</div>
</template>

<style scoped>

</style>
