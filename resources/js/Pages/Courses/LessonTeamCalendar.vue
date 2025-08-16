<script setup lang="ts">

import {computed} from "vue"
import dayjs from "dayjs"

const props = defineProps<{
	calendar: { id: number, day: number, time: string }[],
	n: number
}>()

// Obtenir le jour et l'heure actuels
const now = dayjs()
const currentDay = now.day() === 0 ? 7 : now.day() // dayjs: 0=dimanche, ici 7=dimanche
const currentTime =now.format("HH:mm")

// Trouver le cours en cours
function isOngoing(course: { day: number, time: string }) {
	if (course.day !== currentDay) return false
	const start = dayjs(`${now.format("YYYY-MM-DD")}T${course.time}`)
	const end = start.add(45, "minute")
	return now.isAfter(start) && now.isBefore(end)
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
		if (course.day === currentWeekDay && course.time <= currentTime) return false
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
				<button
					v-for="(course, idx) in nextCourses"
					:key="course.id"
					:class="isOngoing(course) && idx===0?'bg-green-200':'bg-red-200'"
				>
					{{ course.date }} / {{ course.day }} à {{ course.time }}
				</button>
			</div>
		</template>
		<template v-else>
			<span>Aucun cours en cours</span>
		</template>
	</div>
</template>

<style scoped>
.btn {
	margin: 0.5em;
	padding: 0.5em 1em;
	background: #e0e7ff;
	border: 1px solid #6366f1;
	border-radius: 4px;
}
</style>
