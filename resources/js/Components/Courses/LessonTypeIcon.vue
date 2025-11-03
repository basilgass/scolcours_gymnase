<script lang="ts" setup>

import {lessonableClassName} from "@/types/lessonInterfaces.ts"

withDefaults(defineProps<{
	lesson: { lessonable_type: lessonableClassName, lessonable_tag?: 'exercise' | 'howto' | null } | null,
	xl?: boolean
	xs?: boolean
}>(), {
	xl: false,
	xs: false
})
</script>

<template>
	<i
		v-if="lesson"
		:class="{
			'bi bi-book': lesson.lessonable_type==='Post' && !lesson.lessonable_tag,
			'bi bi-journal': lesson.lessonable_type==='Post' && lesson.lessonable_tag==='exercise',
			'bi bi-card-checklist': lesson.lessonable_type==='Post' && lesson.lessonable_tag==='howto',
			'bi bi-patch-question': lesson.lessonable_type==='Challenge',
			'bi bi-question': lesson.lessonable_type==='Generator',
			'bi bi-copy': lesson.lessonable_type==='Deck',
			'text-xl': xl,
			'text-xs': xs,
		}"
	/>
</template>

<style scoped>

</style>
