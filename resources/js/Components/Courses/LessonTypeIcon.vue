<script setup lang="ts">

import {LessonInterface} from "@/types/modelInterfaces.ts"

defineProps<{
	lesson: LessonInterface
}>()
</script>

<template>
	<i
		:class="{
			'bi bi-book': lesson.lessonable_type==='Post',
			'bi bi-question': lesson.lessonable_type==='Challenge' || lesson.lessonable_type==='Generator',
			'bi bi-copy': lesson.lessonable_type==='Deck',
		}"
	/>
</template>

<style scoped>

</style>
