<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue"
import {LessonInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import {computed, inject, ref} from "vue"
import dayjs from "dayjs"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import {AxiosErrorMessage, flashInterface} from "@/types"
import LessonTeamCalendar from "@/Pages/Courses/LessonTeamCalendar.vue"

const props = defineProps<{
	lesson: LessonInterface,
	team: UserTeamInterface
}>()

const editMode = useStoreEditMode()
const flash = inject<flashInterface>('flash')

const isPast = computed(() => {
	return props.lesson.scheduled_at
		? dayjs(props.lesson.scheduled_at).isBefore(dayjs())
		: false
})

const scheduled_at = ref(
	props.lesson.scheduled_at
		? dayjs(props.lesson.scheduled_at).format('YYYY-MM-DDTHH:MM')
		: ""
)


function updateLesson() {
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
</script>

<template>
	<Card>
		<template #header>
			<h3
				v-katex.auto="lesson.title"
				class="text-lg md:text-xl"
			/>
		</template>
		<div>
			<p
				:class="isPast?'bg-red-100 border border-red-500':''"
			>
				La leçon {{ isPast ? 'était' : 'est' }} à terminer {{ lesson.remaining_time }}
			</p>
		</div>
		<template #footer>
			<div>
				<span v-if="lesson.scheduled_at">
					{{ dayjs(lesson.scheduled_at).format('DD MMMM YYYY, [à] HH[h]mm') }}
				</span>
				<span v-else>
					non planifié
				</span>
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
						@button-click="scheduled_at=$event"
						:n="3"
					/>
				</div>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
