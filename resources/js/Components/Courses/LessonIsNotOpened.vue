<script setup lang="ts">

import {LessonInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"
import dayjs from "dayjs"
import Card from "@/Components/Ui/Card.vue"

const props = defineProps<{
	lesson: LessonInterface
}>()

const date = computed(() =>
	props.lesson.calendar.opened_at ? dayjs(props.lesson.calendar.opened_at).toDate() : null
)

const openedAtTime = computed<string>(() => {
	return date.value
		? new Intl.DateTimeFormat('fr-FR', {
			hour: '2-digit',
			minute: '2-digit',
			timeZone: 'Europe/Paris'
		}).format(date.value)
		: ''
})

const openedAtDate = computed(() => {
	return date.value
		? new Intl.DateTimeFormat('fr-FR', {
			dateStyle: 'long',
			timeZone: 'Europe/Paris'
		}).format(date.value)
		: ''
})
</script>

<template>
	<Card class="text-xl md:text-2xl p-10 min-h-[40vh] grid place-items-center">
		<div class="text-center">
			<div>Il est encore trop tôt pour commencer cette leçon!</div>
			<div class="mt-16">
				Ouverture de la leçon
			</div>
			<div class="mt-3 font-semibold">
				{{ openedAtDate }}<span v-if="openedAtTime!=='00:00'"> à {{ openedAtTime }}</span>
			</div>
		</div>
	</Card>
</template>

<style scoped>

</style>
