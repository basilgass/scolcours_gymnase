<script setup lang="ts">

import {UserTeamInterface} from "@/types/modelInterfaces.ts"
import dayjs from "dayjs"
import localeData from "dayjs/plugin/localeData"
import "dayjs/locale/fr"

dayjs.extend(localeData)
dayjs.locale("fr")

const props = defineProps<{
	team: UserTeamInterface
}>()

const dayNames = dayjs.localeData().weekdays()

const horaire = [
	"08:15",
	"09:05",
	"10:10",
	"11:00",
	"11:50",
	"12:35",
	"13:25",
	"14:15",
	"15:05",
	"15:55",
]

function hasCourse(day: number, time: string) {
	return props.team.calendar.find(cal => cal.day == day && cal.time === time)
}

</script>

<template>
	<div>
		<div class="grid grid-cols-6">
			<div />
			<div
				v-for="day in 5"
				:key="`day-${day}`"
			>
				{{ dayNames[day] }}
			</div>
		</div>
		<div
			v-for="(debut, periode) in horaire"
			class="grid grid-cols-6"
		>
			<div>{{ debut }}, p{{ periode + 1 }}</div>
			<div
				v-for="day in 5"
				:key="`day-btn-${day}`"
				:class="hasCourse(day, debut)?'bg-blue-500':''"
			>
				COURS?
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
