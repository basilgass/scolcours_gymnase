<script lang="ts" setup>

import {CourseInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {computed, ref} from "vue"
import ArticleTitle from "@/Components/Ui/ArticleTitle.vue"
import ScButton from "@/Components/Ui/scButton.vue"
import CourseAgenda from "@/Components/Courses/CourseAgenda.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	courses: CourseInterface[],
	teams: TeamInterface[]
}>()

const selectedTeams = ref<TeamInterface[]>([])//(props.teams.filter(t => t.name === 'Gass'))
const selectedCourse = ref<CourseInterface>(null)//(props.courses.find(c => c.id === 4))

const availableCourses = computed(() => {
	if (selectedTeams.value.length === 0) return []

	return props.courses.filter(course => {
			return selectedTeams.value.every(team => course.teams.find(t => t.name === team.name))
		}
	)
})


function toggleTeam(team: TeamInterface) {
	const index = selectedTeams.value.findIndex(t => t.id === team.id)

	if (index === -1) {
		selectedTeams.value.push(team)
		return
	}

	selectedTeams.value.splice(index, 1)
	selectedCourse.value = null
}

function toggleCourse(course: CourseInterface) {
	selectedCourse.value = course
}

</script>

<template>
	<section>
		<article-title
			:return-link="{
				url: route('admin.index'),
				label: 'retour à l\'administration'
			}"
			title="Agenda"
		/>

		<div class="flex flex-wrap gap-3">
			<sc-button
				v-for="team in teams"
				:key="`team-${team.id}`"
				:active="selectedTeams.some(t=> t.name===team.name)"
				type="default"
				@click="toggleTeam(team)"
			>
				<i class="bi bi-people" />{{ team.name }}
			</sc-button>
		</div>

		<div class="flex flex-wrap gap-3 mt-6">
			<sc-button
				v-for="course in availableCourses"
				:key="`course-${course.id}`"
				:active="selectedCourse?.id===course.id"
				@click="toggleCourse(course)"
			>
				<i class="bi bi-book" /> {{ course.title }}
			</sc-button>
		</div>

		<div>
			Le but: afficher un calendrier du début à la fin du cours sélectionner, pour les équipes sélectionnées:

			1. charger en async le calendirer pour chaque équipe.
			2. afficher les "n" semaines.
		</div>

		<course-agenda
			:course="selectedCourse"
			:teams="selectedTeams"
		/>
	</section>
</template>

<style scoped>

</style>
