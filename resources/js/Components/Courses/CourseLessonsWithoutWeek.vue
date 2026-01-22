<script lang="ts" setup>

import {ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import {LessonInterface, TeamInterface} from "@/types/modelInterfaces.ts"
import LessonTypeIcon from "@/Components/Courses/LessonTypeIcon.vue"


const props = defineProps<{
	teamLessons: {
		team: TeamInterface
		lesson: LessonInterface
	}[],
	teams: TeamInterface[]
}>()

interface dragTransferInterface {
	lesson_id: number,
	team_id: number
}

const currentTeamDragItem = ref<string>(null)

function onDragStart(e: DragEvent, item: {
	team: TeamInterface
	lesson: LessonInterface
}) {
	if (!e.dataTransfer) return

	currentTeamDragItem.value = item.team.name

	const payload: dragTransferInterface = {
		lesson_id: item.lesson.id,
		team_id: item.team.id
	}

	e.dataTransfer.setData("application/json", JSON.stringify(payload))
	e.dataTransfer.effectAllowed = "move"

}

function onDragEnd() {
	currentTeamDragItem.value = null
}

</script>

<template>
	<Card class="min-w-40 max-w-50">
		<template #header>
			<div class="font-semibold text-xl">
				sans date
			</div>
		</template>

		<div>
			<div
				v-for="team in teams"
				:key="`team-${team.name}`"
				class="flex flex-col gap-2"
			>
				<div
					v-for="item in teamLessons.filter(tl=>tl.team.id===team.id)"
					:key="`team-${item.team.id}-lesson-${item.lesson.id}-to-be-placed`"
					class="bg-content border rounded item-draggable text-xs flex gap-2 items-top p-1 overflow-hidden cursor-move"
					draggable="true"
					@dragend="onDragEnd"
					@dragstart="event => onDragStart(event, item)"
				>
					<lesson-type-icon :lesson="item?.lesson??null" />
					{{ item.lesson.title }} ({{ item.team.name }})
				</div>
			</div>
		</div>
	</Card>
</template>

<style scoped>

</style>
