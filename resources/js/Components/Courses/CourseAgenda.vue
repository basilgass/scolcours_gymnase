<script lang="ts" setup>

import {CourseInterface, CourseMinInterface, LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {computed, onMounted, ref, watch} from "vue"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import dayjs, {Dayjs} from "dayjs"
import CourseWeekTimetable from "@/Components/Courses/CourseWeekTimetable.vue"
import {weekCalendarInterface} from "@/types/lessonInterfaces.ts"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import CourseLessonsWithoutWeek from "@/Components/Courses/CourseLessonsWithoutWeek.vue"

const flash = useStoreFlashMessage()

const props = defineProps<{
	teams?: TeamInterface[],
	course?: CourseInterface
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

	if (between.value === null) {
		const today = dayjs()
		const currentWeek: number = yearCalendar.value
			.find(d => d.day.isSame(today) || d.day.isAfter(today))?.week ?? null

		if (currentWeek === null) return []

		return getWeeks(
			currentWeek,
			currentWeek
		)
	}

	// Nouvelle version
	// Le premier lundi qui a un cours
	const startMonday = between.value.min.subtract((between.value.min.day() + 6) % 7, 'day')
	// Le numéro de la semaine du cours cours
	const startWeek = yearCalendar.value
		.find(d => d.day.isSame(startMonday) || d.day.isAfter(startMonday))?.week ?? null
	// Pas une semaine valide.
	if (startWeek === null) return

	// Le dernier lundui qui a un cours.
	const endMonday = between.value.max.subtract((between.value.max.day() + 6) % 7, 'day')
	// Le numéro de la semaine précédant ce cours
	const endWeek = yearCalendar.value.find(d => d.day.isSame(endMonday) || d.day.isAfter(endMonday))?.week ?? null
	// Pas une semaine valide.
	if (endWeek === null) return

	return getWeeks(startWeek, endWeek)
})

function getWeeks(startWeek: number, endWeek: number): weekInterface[] {
	const arr: weekInterface[] = []

	// Premier jour de la semaine
	let firstCourseDayOfTheWeek = yearCalendar.value
		.find(d => d.week === startWeek - 1)
		.day


	// Maybe monday is not monday.
	let monday = firstCourseDayOfTheWeek.subtract((firstCourseDayOfTheWeek.day() + 6) % 7, 'day')

	for (let week = startWeek - 1; week <= endWeek + 1; week++) {

		// On contrôle si le lundi est dans une semaine de vacances.
		// Danc ce cas, on ajoute une semaine tant que c'est des vacances.
		while (mondayIsInHolidays(monday)) {
			monday = monday.add(7, 'days')
		}

		arr.push({
			week,
			days: [0, 1, 2, 3, 4, 5].map(d => {
				const day = monday.add(d, 'days')
				return {
					day,
					active: yearCalendar.value.find(d => d.active && d.day.isSame(day)) !== null
				}
			})
		})

		monday = monday.add(1, 'week')
	}

	return arr
}

function mondayIsInHolidays(monday: Dayjs): boolean {
	const firstDayInCalendar = yearCalendar.value
		.find(d => d.day.isSame(monday) || d.day.isAfter(monday))

	return firstDayInCalendar.day.diff(monday, 'day') > 5
}

onMounted(() => {
	getYearCalendar()
	getTeamsCourseCalendar()
})

watch(() => props.course, () => {
	getTeamsCourseCalendar()

})

function updateLesson(event: { lesson_id: number, team_id: number, target: Dayjs, homework: boolean }) {

	// On récupère la "teamLesson" concernée.
	const index = teamLessons.value.findIndex(cal => cal.lesson.id === event.lesson_id && cal.team.id === event.team_id)
	if (index === null) return

	const teamLesson = teamLessons.value[index]

	// On recherche s'il fait partie du calendrier
	const eventDay = event.target.day()
	const calEvents = teamLesson.team.calendar
		.filter(cal => cal.day === eventDay)


	let calEvent = event.homework
		? calEvents.reduce((a, b) => a.time < b.time ? a : b, calEvents[0]) // premier de la journée
		: calEvents.reduce((a, b) => a.time > b.time ? a : b, calEvents[0]) // dernier de la journée

	const [h, m] = calEvent.time.split(':').map(Number)

	teamLesson.lesson.scheduled_at = event.target
		.hour(h).minute(m + (event.homework ? 0 : 45)) // ajouter 45 minutes si pas devoir
		.format('YYYY-MM-DDTHH:mm')

	teamLesson.lesson.homework = event.homework

	// Mise à jour de teamLessons
	teamLessons.value.splice(index, 1)
	teamLessons.value.push(teamLesson)

	// Force course

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

const lessonsToPlace = computed(() => {
	return teamLessons.value.filter(teamLesson => teamLesson.lesson.scheduled_at === null)
})
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

			<course-lessons-without-week
				v-if="lessonsToPlace.length>0"
				:key="`week-not-defined`"
				:team-lessons="lessonsToPlace"
				:teams
				@drop="updateLesson"
			/>
		</div>
	</section>
</template>

<style scoped>

</style>
