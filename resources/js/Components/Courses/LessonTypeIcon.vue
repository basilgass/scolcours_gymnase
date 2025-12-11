<script lang="ts" setup>

import {lessonableClassName} from "@/types/lessonInterfaces.ts"
import {computed} from "vue"

const props = withDefaults(defineProps<{
	lesson: { lessonable_type: lessonableClassName, lessonable_tag?: 'exercise' | 'howto' | null }
		| lessonableClassName
		| null,
	tag?: 'exercise' | 'howto' | null
	xl?: boolean
	xs?: boolean
}>(), {
	xl: false,
	xs: false,
	tag: null,
})

const lessonType = computed(() => {
	if (props.lesson === null) return null

	if (typeof props.lesson === 'string') return props.lesson

	return props.lesson.lessonable_type
})

const tag = computed(() => {
	if (props.tag) return props.tag

	if (typeof props.lesson === 'string') return null

	return props.lesson.lessonable_tag ?? null

})
</script>

<template>
	<i
		v-if="lesson"
		:class="{
			'bi bi-book': lessonType==='Post' && !tag,
			'bi bi-journal': lessonType==='Post' && tag==='exercise',
			'bi bi-card-checklist': lessonType==='Post' && tag==='howto',
			'bi bi-patch-question': lessonType==='Challenge',
			'bi bi-question': lessonType==='Generator',
			'bi bi-copy': lessonType==='Deck',
			'text-xl': xl,
			'text-xs': xs,
		}"
	/>
</template>

<style scoped>

</style>
