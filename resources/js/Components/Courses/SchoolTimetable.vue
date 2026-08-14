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

const timetable = ref<timetableInterface[]>([])

onMounted(() => {
	// Get the timetable
	axios.get(route('api.school.timetables.index'))
		.then((res: AxiosResponseModel<timetableInterface[]>) => {
			timetable.value = res.data

			axios.get(route('api.teams.calendars.index', {team: props.team.id}))
				.then((res: AxiosResponseModel<TeamCalendarInterface[]>) => {
					theItems.value = res.data
				})
				.catch((res: AxiosErrorMessage) => {
					console.warn(res.response.data.message)
				})
		})
		.catch((res: AxiosErrorMessage) => {
			console.warn(res.response.data.message)
		})
})

const itemsInTimetable = computed(() => {
	const arr: Record<number, Record<number, string>> = {}
	for (let day = 1; day <= 5; day++) {
		arr[day] = {}
		timetable.value.forEach(item => {
			arr[day][item.id] = getItem(day, item.id)
		})
	}
	return arr
})

function getItem(day: number, timetableId: number): string {
	if (!theItems.value || theItems.value.length === 0) return ""

	const calendar = theItems.value.find(
		item => item.day === day && item.school_timetable_id === timetableId
	)

	if (!calendar) return ""

	return calendar.time.substring(0, 5)
}

const isDragging = ref(false)
const hoveredCells = ref<Record<string, boolean>>({})
const isOverTrash = ref(false)

interface DragSource {
	day: number | null
	school_timetable_id: number | null
}

function parseDragSource(e: DragEvent): DragSource | null {
	if (!e.dataTransfer) return null
	try {
		return JSON.parse(e.dataTransfer.getData("application/json")) as DragSource
	} catch {
		return null
	}
}

function findCalendarItem(source: DragSource): TeamCalendarInterface | undefined {
	return theItems.value.find(item => item.day === source.day && item.school_timetable_id === source.school_timetable_id)
}

function cellKey(day: number, item: timetableInterface) {
	return `${day}-${item.start}-${item.period}`
}

function isHovered(day: number, item: timetableInterface) {
	return !!hoveredCells.value[cellKey(day, item)]
}

function onDragStart(e: DragEvent, sourceDay: number | null, item: timetableInterface | null) {
	if (!e.dataTransfer) return

	const payload: DragSource = (sourceDay === null || item === null)
		? {day: null, school_timetable_id: null}
		: {day: sourceDay, school_timetable_id: item.id}

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
	isOverTrash.value = false
}

function onTrashDragEnter(e: DragEvent) {
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
	isOverTrash.value = true
}

function onTrashDragLeave() {
	isOverTrash.value = false
}

function onTrashDrop(e: DragEvent) {
	e.preventDefault()
	isOverTrash.value = false

	const source = parseDragSource(e)
	// Un nouvel item (source.day === null) n'est pas encore en DB : rien à supprimer
	if (!source || source.day === null) return

	const item = findCalendarItem(source)
	if (!item) return

	axios.delete(route('api.admin.calendars.destroy', item.id))
		.then(() => {
			theItems.value = theItems.value.filter(current => current.id !== item.id)
		})
		.catch((res: AxiosErrorMessage) => {
			console.warn(res.response.data.message)
		})
}

function onDragOver(e: DragEvent) {
	e.preventDefault()
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
}

function onDrop(e: DragEvent, targetDay: number, targetItem: timetableInterface) {
	e.preventDefault()

	const source = parseDragSource(e)
	if (!source) return

	if (source.day === null) {
		// Nouvel élément
		axios.post(route('api.admin.teams.calendars.store', {team: props.team.id}), {
			day: targetDay,
			school_timetable_id: targetItem.id
		})
			.then((res: AxiosResponseModel<TeamCalendarInterface>) => {
				theItems.value.push(res.data)
			})
			.catch((res: AxiosErrorMessage) => {
				console.warn(res.response.data.message)
			})
		return
	}

	const item = findCalendarItem(source)
	if (!item) return

	axios.patch(route('api.admin.calendars.update', {id: item.id}), {
		day: targetDay,
		school_timetable_id: targetItem.id
	})
		.then((res: AxiosResponseModel<TeamCalendarInterface>) => {
			theItems.value = theItems.value.map(current => current.id === item.id ? res.data : current)
		})
		.catch((res: AxiosErrorMessage) => {
			console.warn(res.response.data.message)
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
					@dragenter="(event: DragEvent) => onDragEnter(event, day, item)"
					@dragleave="(event: DragEvent) => onDragLeave(event, day, item)"
					@drop="(event: DragEvent) => onDrop(event, day, item)"
					@dragover.prevent="onDragOver"
				>
					<div
						v-show="itemsInTimetable[day][item.id]"
						class="text-center bg-content border rounded-full item-draggable cursor-pointer"
						draggable="true"
						@dragend="onDragEnd"
						@dragstart="(event: DragEvent) => onDragStart(event, day, item)"
					>
						{{ itemsInTimetable[day][item.id] }}
					</div>
				</td>
			</tr>
		</tbody>
	</table>

	<div class="mt-3 flex justify-between">
		<sc-button
			id="new-calendar-item"
			class="item-draggable"
			draggable="true"
			icon
			type="add"
			xs
			@dragend="onDragEnd"
			@dragstart="(event: DragEvent) => onDragStart(event, null, null)"
		>
			ajouter une période
		</sc-button>

		<div
			class="border-2 border-red-500 border-dashed w-32 rounded text-center text-red-500 transition-colors duration-150"
			:class="{ 'bg-red-100': isOverTrash }"
			@dragenter="onTrashDragEnter"
			@dragleave="onTrashDragLeave"
			@dragover.prevent="onDragOver"
			@drop="onTrashDrop"
		>
			<span class="pointer-events-none">
				<i class="bi bi-trash mr-2" /> supprimer
			</span>
		</div>
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
