<script lang="ts" setup>

import {CourseInterface, CourseMinInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {computed, onMounted, ref, watch} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import dayjs, {Dayjs} from "dayjs"
import CourseWeekTimetable from "@/Components/Courses/CourseWeekTimetable.vue"
import {weekCalendarInterface} from "@/types/lessonInterfaces.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const flash = useStoreFlashMessage()

const props = defineProps<{
	teams?: TeamInterface[],
	course?: CourseMinInterface
}>()

const teamLessons = ref<{
	team: TeamInterface
	lesson: LessonInterface
}[]>([])

const isLoading = computed(() => {
	return loadingCalendars.value !== props.teams.length || teamLessons.value.length === 0
})

const calendar = computed<weekCalendarInterface[]>(() => {
	if (isLoading.value) return []

	return teamLessons.value.map(teamLesson => {
		return {
			...teamLesson,
			day: dayjs(teamLesson.lesson.scheduled_at),
		}
	})
})

interface yearDay {
	active: boolean
	day: Dayjs
	week: number,
}

const yearCalendar = ref<yearDay[]>([])

function getYearCalendar() {
	axios.get(route('api.school.calendar'))
		.then((res: AxiosResponseModel<{ week: number, school: boolean, day: string }[]>) => {
			yearCalendar.value = res.data.map(d => {
				return {
					week: d.week,
					day: dayjs(d.day),
					active: d.school
				}
			})
		})
}

// récupérer les données des équipes sélectionnées pour le cours donné
const loadingCalendars = ref(0)

function getTeamsCourseCalendar() {
	loadingCalendars.value = 0
	teamLessons.value = []

	if (props.teams.length === 0) return
	if (!props.course) return

	props.teams.forEach(team => {
		getTeamCourseCalendar(props.course, team)
	})
}

function getTeamCourseCalendar(course: CourseMinInterface, team: TeamInterface) {
	axios.get(route('api.teams.course.calendar', {team: team.id, course: course.id}))
		.then((res: AxiosResponseModel<CourseInterface>) => {
			res.data.lessons.forEach(lesson => {
				teamLessons.value.push({
					team,
					lesson
				})

			})
		})
		.catch(res => console.log(res))
		.finally(() => {
			loadingCalendars.value++
		})

}

const between = computed<{ min: Dayjs, max: Dayjs }>(() => {
	if (isLoading.value) return null

	const days = teamLessons.value
		.filter(teamLesson => teamLesson.lesson.scheduled_at)
		.map(teamLesson => dayjs(teamLesson.lesson.scheduled_at))

	if (days.length === 0) return null

	const min = days.reduce((a, b) => a.isBefore(b) ? a : b, days[0])
	const max = days.reduce((a, b) => a.isAfter(b) ? a : b, days[0])

	// calculer le lundi (avant ou égal à `min`)
	// const monday = min.subtract((min.day() + 6) % 7, 'day')

	return {min, max}
})

// On récupère toutes les semaines entre min et max
interface weekInterface {
	days: { day: Dayjs, active: boolean }[]
	week: number,
}

const weeks = computed<weekInterface[]>(() => {
	if (isLoading.value) return []

	const arr: weekInterface[] = []

	if (between.value === null) return []

	// Le premier lundi de l'intervalle à analyser
	let monday = between.value.min.subtract((between.value.min.day() + 6) % 7, 'day')
		.subtract(7, 'days')

	const maxMonday = between.value.max.add(7, 'days')
	// Le numéro de la semaine.
	let weekNumber = yearCalendar.value.find(d => d.day.isSame(monday) || d.day.isAfter(monday))?.week ?? null

	if (weekNumber === null) return []

	while (monday.isSame(maxMonday, 'day') || monday.isBefore(maxMonday)) {
		if (weekNumber > 52) return []

		// Récupère la première dans le yearCalendar qui est égal ou dépasse monday.
		const day = yearCalendar.value.find(d => d.day.isSame(monday) || d.day.isAfter(monday))

		// Si la semaine existe déjà, c'est qu'on est passé sur des vacances.
		// Il faut remettre à jour les dates avec les nouvelles !
		const week = (arr.length > 0 && arr[arr.length - 1].week === day.week)
			? arr.pop()
			: {
				week: day.week,
				days: []
			}

		// Reset the days.
		week.days = []

		for (let i = 0; i <= 5; i++) {
			const day = monday.add(i, 'days')
			week.days.push({
				day,
				active: yearCalendar.value.find(d => d.active && d.day.isSame(day)) !== null
			})
		}

		arr.push(week)

		weekNumber = week.week
		monday = monday.add(1, "weeks")
	}

	return arr
})


onMounted(() => {
	getYearCalendar()

	// getTeamsCourseCalendar()
})

watch(() => props.course, () => {
	getTeamsCourseCalendar()

})

function updateLesson(event: { lesson_id: number, team_id: number, target: Dayjs, homework: boolean }) {
	// On récupère la "teamLesson" concernée.
	const index = teamLessons.value.findIndex(cal => cal.lesson.id === event.lesson_id && cal.team.id === event.team_id)
	if (index === null) return

	const teamLesson = teamLessons.value[index]
	const eventDay = event.target.day()
	const calEvents = teamLesson.team.calendar
		.filter(cal => cal.day === eventDay)

	if (calEvents.length === 0) {
		flash.error(`La ${teamLesson.team.name} n'a pas de calendrier de cours.`,
			{
				link: {
					label: 'Créer un calendrier des cours',
					url: route('admin.teams.show', {team: teamLesson.team.name})
				}
			})
		return
	}

	let calEvent = event.homework
		? calEvents.reduce((a, b) => a.time < b.time ? a : b, calEvents[0]) // premier de la journée
		: calEvents.reduce((a, b) => a.time > b.time ? a : b, calEvents[0]) // dernier de la journée

	const [h, m] = calEvent.time.split(':').map(Number)

	teamLesson.lesson.scheduled_at = event.target
		.hour(h).minute(m + (event.homework ? 0 : 45)) // ajouter 45 minutes si pas devoir
		.format('YYYY-MM-DDTHH:mm')

	teamLesson.lesson.homework = event.homework

	teamLessons.value.splice(index, 1)
	teamLessons.value.push(teamLesson)

	axios
		.patch(route('api.admin.teams.lessons.update', {
			lesson: teamLesson.lesson.id,
			team: teamLesson.team.id,
		}), {
			scheduled_at: teamLesson.lesson.scheduled_at,
			homework: teamLesson.lesson.homework
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
	<section>
		LES CALENDRIERS du <span v-if="between!==null">{{
			between.min.format('YYYY.MM.DD')
		}} au {{ between.max.format('YYYY.MM.DD') }}</span>

		<div class="flex flex-col gap-8">
			<course-week-timetable
				v-for="week in weeks"
				:key="`week-${week.week}`"
				:calendar
				:from="week.days[0].day"
				:teams
				:to="week.days[4].day"
				:week="week.week"
				@drop="updateLesson"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
