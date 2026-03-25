<script lang="ts" setup>

import {computed, ref} from "vue"
import {Dayjs} from "dayjs"
import {
	itemInTimetableInterface,
	weekCalendarDagTransferInterface,
	weekCalendarInterface
} from "@/types/lessonInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"
import {TeamInterface} from "@/types/modelInterfaces.ts"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"


const props = defineProps<{
	week: number,
	from: Dayjs,
	to: Dayjs,
	calendar: weekCalendarInterface[],
	teams: TeamInterface[]
}>()

const courseByDay = computed(() => {
	const arr: Record<number, number[]> = {}

	props.teams.forEach(team => {
		arr[team.id] = [...new Set((team.calendar ?? []).map(cal => cal.day))]
	})

	return arr
})


const itemsInTimetable = computed<Record<string, itemInTimetableInterface>>(() => {
	const arr: Record<string, itemInTimetableInterface> = {}
	props.teams.forEach(team => {
		arr[team.name] = teamItemsInTimetable(team)
	})

	return arr
})

function teamItemsInTimetable(team: TeamInterface): itemInTimetableInterface {
	const arr: Record<number, weekCalendarInterface[]> = {}
	for (let day = 1; day <= 5; day++) {
		arr[day] = getItems(team, day)
	}
	return arr
}

function getItems(team: TeamInterface, day: number): weekCalendarInterface[] {
	if (!props.calendar || props.calendar.length === 0) return null

	const dayDate = props.from.add(day - 1, 'days')

	return props.calendar.filter(item => {
			return item.team.id === team.id &&
				item.day.isSame(dayDate, 'day')
		}
	)
}

const isDragging = ref(false)
const hoveredCells = ref<Record<string, boolean>>({})

function cellKey(team: TeamInterface, day: number) {
	return `w${props.week}-${team.name}-${day}`
}

function isHovered(team: TeamInterface, day: number) {
	if (team.name !== currentTeamDragItem.value) return false

	return !!hoveredCells.value[cellKey(team, day)]
}

const currentTeamDragItem = ref<string>(null)

function onDragStart(e: DragEvent, sourceDay: number, item: weekCalendarInterface) {
	if (!e.dataTransfer) return

	currentTeamDragItem.value = item.team.name

	const payload: weekCalendarDagTransferInterface = {
		day: props.from.add(sourceDay - 1, 'days'),
		lesson_id: item.lesson.id,
		team_id: item.team.id
	}

	e.dataTransfer.setData("application/json", JSON.stringify(payload))
	e.dataTransfer.effectAllowed = "move"

	isDragging.value = true
}

function onDragEnter(e: DragEvent, team: TeamInterface, day: number) {
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
	hoveredCells.value[cellKey(team, day)] = true
}

function onDragLeave(e: DragEvent, team: TeamInterface, day: number) {
	hoveredCells.value[cellKey(team, day)] = false
}

function onDragEnd() {
	isDragging.value = false
	hoveredCells.value = {}
	currentTeamDragItem.value = null
}

function onDragOver(e: DragEvent) {
	e.preventDefault()
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
}

function onDrop(e: DragEvent, tday: number) {
	e.preventDefault()

	const targetDay = (tday - 1) % 5 + 1

	if (!e.dataTransfer) return
	const dataJson = e.dataTransfer.getData("application/json")

	let source: weekCalendarDagTransferInterface = null

	try {
		source = JSON.parse(dataJson)
	} catch {
		source = null
	}

	if (!source) return

	// On vérifie que le cours exist à cette date.
	if (!courseByDay.value[source.team_id].includes(targetDay)) {
		alert("Le cours n'existe pas ce jour.")
		return
	}

	// Sauvegarde des informations (axios)
	const target = props.from.add(targetDay - 1, 'days')
	// Emettre l'information aux parents pour la mise à jour du calendrier.
	emit('drop', {
		...source,
		target,
		homework: tday <= 5
	})
}

const emit = defineEmits<{
	drop: [ev: {
		lesson_id: number,
		team_id: number,
		target: Dayjs,
		homework: boolean
	}]
}>()

</script>

<template>
	<Card>
		<template #header>
			<div class="font-semibold text-xl">
				Semaine {{ week }}, du {{ from.format('DD.MM.YYYY') }} au
				{{ to.format('DD.MM.YYYY') }}
			</div>
		</template>

		<div class="grid grid-cols-1 gap-1">
			<div class="grid grid-cols-5 gap-x-3">
				<div>lundi</div>
				<div>mardi</div>
				<div>mercredi</div>
				<div>jeudi</div>
				<div>vendredi</div>
			</div>

			<div
				v-for="team in teams"
				:key="`team-${team.name}`"
				class="grid grid-cols-5 gap-x-3 gap-y-1"
			>
				<div
					v-for="day in 10"
					:key="`devoirs-${day}`"
					:class="[
						'px-3 min-h-[2em] rounded-lg border border-dashed transition-colors duration-150',
						{
							'border-orange-400 bg-orange-100': courseByDay[team.id].includes(day) && day<=5,
							'bg-orange-200': courseByDay[team.id].includes(day) && day<=5 && isHovered(team, day),
							'border-blue-400 bg-blue-100': courseByDay[team.id].includes((day-1)%5+1) && day > 5,
							'bg-blue-200': courseByDay[team.id].includes((day-1)%5+1) && day > 5 && isHovered(team, day),
							'opacity-20 cursor-not-allowed': !courseByDay[team.id].includes((day-1)%5+1)
						}
					]"
					@dragenter="event => onDragEnter(event, team, day)"
					@dragleave="event => onDragLeave(event, team, day)"
					@drop="event => onDrop(event, day)"
					@dragover.prevent="onDragOver"
				>
					<div
						v-for="item in itemsInTimetable[team.name][(day-1)%5+1].filter(item=>item.lesson.homework === (day<=5) )"
						:key="`team-${item.team.id}-lesson-${item.lesson.id}`"
						class="bg-content border rounded item-draggable text-xs flex gap-2 items-top p-1 overflow-hidden cursor-move"
						draggable="true"
						@dragend="onDragEnd"
						@dragstart="event => onDragStart(event, day, item)"
					>
						<lesson-type-icon :lesson="item?.lesson??null" />
						{{ item.lesson.title }} ({{ item.team.name }})
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>

<style scoped>

</style>
