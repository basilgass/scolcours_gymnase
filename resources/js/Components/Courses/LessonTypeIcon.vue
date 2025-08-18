<script setup lang="ts">

import {lessonableClassName} from "@/types/lessonInterfaces.ts"

withDefaults(defineProps<{
	lesson: { lessonable_type: lessonableClassName },
	xl?: boolean
	xs?: boolean
}>(), {
	xl: false,
	xs: false
})
</script>

<template>
	<i
		:class="{
			'bi bi-book': lesson.lessonable_type==='Post',
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
