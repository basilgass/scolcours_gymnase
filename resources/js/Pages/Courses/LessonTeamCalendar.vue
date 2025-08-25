<script setup lang="ts">

import {computed} from "vue"
import dayjs from "dayjs"
import ScButton from "@/Components/Ui/scButton.vue"

const props = defineProps<{
	calendar: { id: number, day: number, time: string }[],
	n: number
}>()

const emits = defineEmits<{
	buttonClick: [value: string]
}>()

// Obtenir le jour et l'heure actuels
const now = dayjs()
const currentDay = now.day() === 0 ? 7 : now.day() // dayjs: 0=dimanche, ici 7=dimanche
const currentTime = now.format("HH:mm")
const lessonDuration = 45

function buttonLabel(date: string, time: string, before: boolean): string {
	return dayjs(date + 'T' + time)
		.add(before ? 0 : lessonDuration, 'minute')
		.locale('fr')
		.format('dddd DD.MM.YYYY, à HH[h]mm')

}

// Trouver le cours en cours
function isOngoing(course: { day: number, time: string }) {
	if (course.day !== currentDay) return false
	const start = dayjs(`${now.format("YYYY-MM-DD")}T${course.time}`)
	const end = start.add(lessonDuration, "minute")
	return now.isAfter(start) && now.isBefore(end)
}

function onButtonClick(value: { id: number, day: number, time: string, date: string }, before: boolean) {
	const datetimeLocal = dayjs(value.date + 'T' + value.time)
		.add(before ? 0 : lessonDuration, 'minute')
		.format('YYYY-MM-DDTHH:mm')

	emits('buttonClick', datetimeLocal)
}

const nextCourses = computed(() => {
	if (props.n <= 0 || props.calendar.length === 0) {
		return []
	}

	const result = []
	let baseDate = now.startOf("day")
	let currentWeekDay = currentDay

	// On trie le calendrier par jour et heure
	const sortedCalendar = [...props.calendar].sort((a, b) => {
		if (a.day !== b.day) return a.day - b.day
		return a.time.localeCompare(b.time)
	})

	// Trouver le prochain cours à partir de maintenant
	let idx = sortedCalendar.findIndex(course => {
		if (course.day < currentWeekDay) return false
		// if (course.day === currentWeekDay && course.time <= currentTime) return false
		return true
	})

	// Si aucun cours restant cette semaine, recommencer au début
	if (idx === -1) idx = 0

	let weekOffset = 0
	while (result.length < props.n) {
		const course = sortedCalendar[idx]
		// Calculer la date du prochain cours
		let daysToAdd = (course.day - currentWeekDay) + weekOffset * 7
		if (daysToAdd < 0) daysToAdd += 7
		const courseDate = baseDate.add(daysToAdd, "day")

		result.push({
			...course,
			is_today: courseDate.isSame(dayjs(), 'day'),
			date: courseDate.format("YYYY-MM-DD"),
		})

		idx++
		if (idx >= sortedCalendar.length) {
			idx = 0
			weekOffset++
		}
	}

	return result
})

</script>

<template>
	<div>
		<template v-if="nextCourses.length">
			<div class="flex gap-3">
				<div
					v-for="(course, idx) in nextCourses"
					:key="course.id"
					class="flex flex-col gap-3"
				>
					<sc-button
						xs
						:outline="!course.is_today"
						theme
						@click="onButtonClick(course, true)"
					>
						{{ buttonLabel(course.date, course.time, true) }}
					</sc-button>
					<sc-button
						xs
						:outline="!course.is_today"
						theme
						@click="onButtonClick(course, false)"
					>
						{{ buttonLabel(course.date, course.time, false) }}
					</sc-button>
				</div>
			</div>
		</template>
		<template v-else>
			<span>Aucun cours en cours</span>
		</template>
	</div>
</template>

