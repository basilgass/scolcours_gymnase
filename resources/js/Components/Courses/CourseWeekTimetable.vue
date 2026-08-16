<script lang="ts" setup>

import {computed, ref} from "vue"
import {Dayjs} from "dayjs"
import {
	itemInTimetableInterface,
	lessonBandColors,
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
	days: { day: Dayjs, active: boolean }[],
	teams: TeamInterface[]
}>()

type BandId = 'homework' | 'lesson' | 'deadline'

interface BandConfig {
	id: BandId,
	label: string,
	base: string,   // couleur droppable
	hover: string,  // couleur au survol d'un drag
	text: string    // couleur du libellé de la bande
}

const bands: BandConfig[] = [
	{id: 'homework', label: 'Devoirs', ...lessonBandColors.homework},
	{id: 'lesson', label: 'Leçons', ...lessonBandColors.lesson},
	{id: 'deadline', label: 'Échéance', ...lessonBandColors.deadline}
]

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
	if (!props.calendar || props.calendar.length === 0) return []

	const dayDate = props.from.add(day - 1, 'days')

	return props.calendar.filter(item => {
			return item.team.id === team.id &&
				item.day.isSame(dayDate, 'day')
		}
	)
}

// Jour scolaire (colonne `school` de school_calendars, remontée en `active`).
function isSchoolDay(weekday: number): boolean {
	return props.days[weekday - 1]?.active ?? false
}

// Jour de présence de l'équipe (créneaux du team_calendar).
function isPresenceDay(team: TeamInterface, weekday: number): boolean {
	return courseByDay.value[team.id]?.includes(weekday) ?? false
}

// Items d'une bande donnée pour un jour donné.
function itemsForBand(team: TeamInterface, weekday: number, band: BandId): weekCalendarInterface[] {
	const items = itemsInTimetable.value[team.name]?.[weekday] ?? []

	if (band === 'deadline') {
		return items.filter(item => item.lesson.deadline)
	}
	if (band === 'homework') {
		return items.filter(item => item.lesson.homework && !item.lesson.deadline)
	}
	return items.filter(item => !item.lesson.homework && !item.lesson.deadline)
}

// Un jour non-scolaire n'accepte rien ; les échéances ignorent la présence, pas devoirs/leçons.
function isDroppable(team: TeamInterface, weekday: number, band: BandId): boolean {
	if (!isSchoolDay(weekday)) return false
	if (band === 'deadline') return true
	return isPresenceDay(team, weekday)
}

function bandPayload(band: BandId): { homework: boolean, deadline: boolean } {
	if (band === 'deadline') return {homework: true, deadline: true}
	if (band === 'homework') return {homework: true, deadline: false}
	return {homework: false, deadline: false}
}

const isDragging = ref(false)
const hoveredCells = ref<Record<string, boolean>>({})

function cellKey(team: TeamInterface, weekday: number, band: BandId) {
	return `w${props.week}-${team.name}-${band}-${weekday}`
}

function isHovered(team: TeamInterface, weekday: number, band: BandId) {
	if (team.name !== currentTeamDragItem.value) return false

	return !!hoveredCells.value[cellKey(team, weekday, band)]
}

const currentTeamDragItem = ref<string | null>(null)

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

function onDragEnter(e: DragEvent, team: TeamInterface, weekday: number, band: BandId) {
	if (e.dataTransfer) e.dataTransfer.dropEffect = "move"
	hoveredCells.value[cellKey(team, weekday, band)] = true
}

function onDragLeave(e: DragEvent, team: TeamInterface, weekday: number, band: BandId) {
	hoveredCells.value[cellKey(team, weekday, band)] = false
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

function onDrop(e: DragEvent, weekday: number, band: BandId) {
	e.preventDefault()

	if (!e.dataTransfer) return
	const dataJson = e.dataTransfer.getData("application/json")

	let source: weekCalendarDagTransferInterface | null = null

	try {
		source = JSON.parse(dataJson)
	} catch {
		source = null
	}

	if (!source) return

	const team = props.teams.find(t => t.id === source?.team_id)
	if (!team) return

	// Jour non-scolaire, ou hors présence pour devoirs/leçons : rejet silencieux.
	if (!isDroppable(team, weekday, band)) return

	const target = props.from.add(weekday - 1, 'days')
	const payload = bandPayload(band)

	// Emettre l'information aux parents pour la mise à jour du calendrier.
	emit('drop', {
		...source,
		target,
		homework: payload.homework,
		deadline: payload.deadline
	})
}

const emit = defineEmits<{
	drop: [ev: {
		lesson_id: number,
		team_id: number,
		target: Dayjs,
		homework: boolean,
		deadline: boolean
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
				class="space-y-2"
			>
				<div
					v-for="band in bands"
					:key="`team-${team.name}-band-${band.id}`"
					class="space-y-1"
				>
					<div
						class="text-xs font-semibold"
						:class="band.text"
					>
						{{ team.name }} — {{ band.label }}
					</div>

					<div class="grid grid-cols-5 gap-x-3 gap-y-1">
						<div
							v-for="weekday in 5"
							:key="`${band.id}-${weekday}`"
							:data-band="band.id"
							:data-weekday="weekday"
							:class="[
								'px-3 min-h-[2em] rounded-lg border border-dashed transition-colors duration-150',
								isDroppable(team, weekday, band.id)
									? [band.base, isHovered(team, weekday, band.id) ? band.hover : '']
									: 'opacity-20 cursor-not-allowed'
							]"
							@dragenter="event => onDragEnter(event, team, weekday, band.id)"
							@dragleave="event => onDragLeave(event, team, weekday, band.id)"
							@drop="event => onDrop(event, weekday, band.id)"
							@dragover.prevent="onDragOver"
						>
							<div
								v-for="item in itemsForBand(team, weekday, band.id)"
								:key="`team-${item.team.id}-lesson-${item.lesson.id}`"
								class="bg-content border rounded item-draggable text-xs flex gap-2 items-top p-1 overflow-hidden cursor-move"
								draggable="true"
								@dragend="onDragEnd"
								@dragstart="event => onDragStart(event, weekday, item)"
							>
								<lesson-type-icon :lesson="item?.lesson??null" />
								{{ item.lesson.label ?? item.lesson.title }} ({{ item.team.name }})
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card>
</template>

<style scoped>

</style>
