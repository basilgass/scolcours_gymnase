<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"
import {LessonInterface} from "@/types/modelInterfaces.ts"

const lesson = defineModel<LessonInterface>('lesson')

// const props = defineProps<{}>()

// const bar = computed(() => {
// 	const start = new Date(lesson.value.calendar.opened_at).getTime()
// 	const end = new Date(lesson.value.calendar.scheduled_at).getTime()
//
// 	const left = ((start - new Date(props.timing.min).getTime()) / props.timing.total) * 100
// 	const width = ((end - start) / props.timing.total) * 100
//
// 	return {left, width}
// })
</script>

<template>
	<div class="flex max-w-sm gap-3">
		<!--		<form-maker-->
		<!--			label="ouverture"-->
		<!--			type="datetime-local"-->
		<!--			v-model="lesson.calendar.opened_at"-->
		<!--			class="w-[200px]"-->
		<!--		/>-->

		<!--		<form-maker-->
		<!--			label="fermeture"-->
		<!--			type="datetime-local"-->
		<!--			v-model="lesson.calendar.scheduled_at"-->
		<!--			class="w-[200px]"-->
		<!--		/>-->
	</div>
</template>

<style scoped>

</style>
