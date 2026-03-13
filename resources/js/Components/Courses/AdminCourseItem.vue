<script setup lang="ts">

import Card from "@/Components/Ui/Card.vue";
import ScButton from "@/Components/Ui/Button/scButton.vue";
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue";
import {CourseInterface, UserTeamInterface} from "@/types/modelInterfaces.ts";
import {ref} from "vue";
import axios from "axios";
import {AxiosErrorMessage, AxiosResponseModel} from "@/types";
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts";

const flash = useStoreFlashMessage()

const props = defineProps<{
	course: CourseInterface,
	teams: UserTeamInterface[]
}>()

const emits = defineEmits<{
	'delete': [id: number]
}>()

const assignTeams = ref(false)
const currentTeams = ref<UserTeamInterface[]>(props.course.teams)

function toggleTeam(course: CourseInterface, team: UserTeamInterface) {
	axios
		.patch(route('api.admin.courses.teams.toggle', {course: course.id, team: team.id}))
		.then((res: AxiosResponseModel<boolean>) => {
			if (res.data) {
				// On ajoute la team
				currentTeams.value.push(team)
			} else {
				// On supprime la team
				const t = currentTeams.value.findIndex(t => t.id === team.id)
				currentTeams.value.splice(t, 1)
			}
			flash.success('édition effectuée')
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
			flash.error('problème')
		})
}

function deleteCourse(id: number) {
	axios.delete(route('api.admin.courses.destroy', {id}))
		.then(() => {
			emits('delete', id)
		})
		.catch((err: AxiosErrorMessage) => {
			console.warn(err.response.data.message)
		})
}

</script>

<template>
	<Card>
		<template #header>
			<div class="text-lg flex flex-col md:flex-row gap-1 md:gap-5 ">
				<h2 v-katex.auto="course.title" class="flex-1" />

				<div class="flex gap-2">
					<sc-button
						type="edit"
						xs
						icon
						:href="route('admin.courses.edit', {course: course.slug})"
					/>
					<confirm-button
						icon
						xs
						@confirm="deleteCourse(course.id)"
					>
						supprimer
					</confirm-button>
				</div>
			</div>
		</template>

		<div class="flex gap-2" v-if="currentTeams.length">
			<sc-button
				v-for="team in currentTeams"
				:key="`course-${course.id}-${team.name}`"
				type="primary"
				xs
				:href="route('admin.courses.teams.dashboard', {course: course.slug, team: team.name})"
			>
				{{ team.name }}
			</sc-button>

			<sc-button
				xs
				outline
				class="md:ml-auto"
				type="edit"
				icon
				@click="assignTeams=!assignTeams"
			></sc-button>

		</div>
		<div v-else>
			<sc-button type="edit" icon xs outline @click="assignTeams=!assignTeams">ajouter une équipe</sc-button>
		</div>

		<template #footer v-if="assignTeams">
			<div class="flex gap-3 -my-1 -mx-3 py-1 px-3" v-theme.admin>
				<sc-button
					v-for="team in teams"
					:key="`team-${team.name}`"
					xs
					outline
					type="primary"
					@click="toggleTeam(course, team)"
				>
					{{ team.name }}
				</sc-button>
			</div>
		</template>
	</Card>
</template>

<style scoped>

</style>
