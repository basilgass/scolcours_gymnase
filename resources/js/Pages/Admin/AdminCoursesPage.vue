<script setup lang="ts">

import {CourseInterface, TeamInterface, UserTeamInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {inject} from "vue"
import {AxiosErrorMessage, AxiosResponseModel, flashInterface} from "@/types"
import Card from "@/Components/Ui/Card.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import axios from "axios"

defineOptions({layout: LayoutMain})
const flash = inject<flashInterface>("flash")

const props = defineProps<{
	courses: CourseInterface[],
	teams: UserTeamInterface[]
}>()

function toggleTeam(course: CourseInterface, team: UserTeamInterface){
	axios
		.patch(route('api.admin.courses.toggle-team', {course: course.id, team: team.id}))
		.then((res)=>{
			// TODO: Mettre à jour la carte de la leçon.
			flash.success('édition effectuée')
		})
		.catch((err: AxiosErrorMessage)=>{
			console.warn(err.response.data.message)
			flash.error('problème')
		})
}
</script>

<template>
	<section>
		<div class="grid grid-cols-1 gap-3 mt-10">
			<Card
				v-for="course in courses"
				:key="course.id"
			>
				<template #header>
					<div class="flex justify-between">
						<h2 v-katex.auto="course.title" />
						<div class="flex gap-3">
							<sc-button
								type="primary"
								xs
								v-for="team in course.teams"
								:key="`course-${course.id}-${team.name}`"
								:href="route('admin.courses.show-team', {course: course.slug, team: team.name})"
							>
								{{ team.name }}
							</sc-button>
							<sc-button
								type="edit"
								xs
								icon
								:href="route('admin.courses.edit', {course: course.slug})"
							/>
						</div>
					</div>
				</template>
				<div class="flex gap-3">
					<sc-button
						xs
						v-for="team in teams"
						:key="`team-${team.name}`"
						outline
						type="primary"
						@click="toggleTeam(course, team)"
					>
						{{ team.name }}
					</sc-button>
				</div>
			</Card>
		</div>
	</section>
</template>

<style scoped>

</style>
