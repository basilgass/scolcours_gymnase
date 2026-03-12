<script lang="ts" setup>

import {computed, onMounted, ref} from "vue"
import axios from "axios"
import {AxiosErrorMessage, AxiosResponseModel} from "@/types"
import {TeamCalendarInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {timetableInterface} from "@/types/lessonInterfaces.ts"


const props = defineProps<{
	team: TeamInterface,
}>()
const theItems = ref<TeamCalendarInterface[]>([])

const timetable = ref<timetableInterface[]>(null)

onMounted(() => {
	// Get the timetable
	axios.get(route('api.school.timetable'))
		.then((res: AxiosResponseModel<timetableInterface[]>) => {
			timetable.value = res.data

			axios.get(route('api.teams.calendar', {team: props.team.id}))
				.then((res: AxiosResponseModel<TeamCalendarInterface[]>) => {
					theItems.value = res.data
				})
				.catch((res: AxiosErrorMessage) => {
					console.warn(res.response.data.message)
				})
		})
		.catch((res: AxiosErrorMessage) => {
			console.log(res)
			console.warn(res.response.data.message)
		})
})

const itemsInTimetable = computed(() => {
	const arr: Record<number, Record<string, string>> = {}
	for (let day = 1; day <= 5; day++) {
		arr[day] = {}
		timetable.value.forEach(item => {
			arr[day][item.start] = getItem(day, item.start)
		})
	}

	return arr
})

function getItem(day: number, start_time: string): string {
	if (!theItems.value || theItems.value.length === 0) return ""

	const calendar: TeamCalendarInterface = theItems.value.find(
		item => item.day === day && item.time === start_time
	)

	if (!calendar) return ""

	return calendar.time.substring(0, 5)
}

const isDragging = ref(false)
const hoveredCells = ref<Record<string, boolean>>({})

function cellKey(day: number, item: timetableInterface) {
	return `${day}-${item.start}-${item.period}`
}

function isHovered(day: number, item: timetableInterface) {
	return !!hoveredCells.value[cellKey(day, item)]
}

function onDragStart(e: DragEvent, sourceDay: number, item: timetableInterface) {
	if (!e.dataTransfer) return

	const payload = sourceDay === null
		? {day: null, start: null, period: null}
		: {day: sourceDay, start: item.start, period: item.period}

	e.dataTransfer.setData("application/json", JSON.stringify(payload))
	e.dataTransfer.effectAllowed = "move"

	isDragging.value = true
}

function onDragEnter(e: DragEvent, day: number, item: timetableInterface) {
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
	hoveredCells.value[cellKey(day, item)] = true
}

function onDragLeave(e: DragEvent, day: number, item: timetableInterface) {
	hoveredCells.value[cellKey(day, item)] = false
}

function onDragEnd() {
	isDragging.value = false
	hoveredCells.value = {}
}

function onDragOver(e: DragEvent) {
	e.preventDefault()
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
}

function onDrop(e: DragEvent, targetDay: number, targetItem: timetableInterface) {
	e.preventDefault()
	if (!e.dataTransfer) return

	const dataJson = e.dataTransfer.getData("application/json")
	let source: { day: number; start: string; period: number } | null = null

	try {
		source = JSON.parse(dataJson)
	} catch {
		source = null
	}

	if (!source) return

	if (source.day === null) {
		// Nouvel élément
		axios.post(route('api.admin.teams.calendars.store', {team: props.team.id}), {
			day: targetDay,
			time: targetItem.start
		})
			.then((res: AxiosResponseModel<TeamCalendarInterface>) => {
				theItems.value.push(res.data)
			})
			.catch((res: AxiosErrorMessage) => {
				console.warn(res.response.data.message)
			})
		return
	}
	const item = theItems.value.find(item => item.day === source.day && item.time === source.start)
	if (!item) return

	axios.patch(route('api.admin.calendars.update', {id: item.id}), {
		day: targetDay,
		time: targetItem.start
	})
		.then((res) => {
			theItems.value = theItems.value.map(item => {
				if (item.day === source.day && item.time === source.start) {
					item.day = targetDay
					item.time = targetItem.start
				}

				return item
			})
		})

}

</script>

<template>
	<table class="w-full">
		<thead>
		<tr>
			<th />
			<th>
				lundi
			</th>
			<th>
				mardi
			</th>
			<th>
				mercredi
			</th>
			<th>
				jeudi
			</th>
			<th>
				vendredi
			</th>
		</tr>
		</thead>
		<tbody>
		<tr
			v-for="item in timetable"
			:key="`p-${item.period}`"
		>
			<td>
				<div class="flex justify-between items-center gap-1 px-2">
					<div class="font-semibold">
						P{{ item.period }}
					</div>
					<div class="text-xs">
						{{ item.start.substring(0, 5) }}<br>{{ item.end.substring(0, 5) }}
					</div>
				</div>
			</td>
			<td
				v-for="day in 5"
				:key="`day-${day}-p${item.period}`"
				:class="[
						'px-3',
						{
							'bg-blue-100 transition-colors duration-150': isHovered(day, item)
						}
					]"
				@dragenter="event => onDragEnter(event, day, item)"
				@dragleave="event => onDragLeave(event, day, item)"
				@drop="event => onDrop(event, day, item)"
				@dragover.prevent="onDragOver"
			>
				<div
					v-show="itemsInTimetable[day][item.start]"
					class="text-center bg-content border rounded-full item-draggable"
					draggable="true"
					@dragend="onDragEnd"
					@dragstart="event => onDragStart(event, day, item)"
				>
					{{ itemsInTimetable[day][item.start] }}
				</div>
			</td>
		</tr>
		</tbody>
	</table>

	<div class="mt-3">
		<sc-button
			id="new-calendar-item"
			class="item-draggable"
			draggable="true"
			icon
			type="add"
			xs
			@dragend="onDragEnd"
			@dragstart="event => onDragStart(event, null, null)"
		>
			ajouter une période
		</sc-button>
	</div>
</template>

<style scoped>
table {
	border-collapse: collapse;
	width: 100%;
	table-layout: fixed;
}

td {
	border: 1px solid #bbbbbb;
}

th:first-child {
	width: 80px;
}

th:not(:first-child) {
	width: calc((100% - 80px) / 5);
}
</style>
