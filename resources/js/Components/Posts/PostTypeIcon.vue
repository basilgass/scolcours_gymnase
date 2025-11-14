<script lang="ts" setup>

import {PostInterface} from "@/types/modelInterfaces.ts"
import {computed} from "vue"

const props = withDefaults(defineProps<{
	post: PostInterface | 'exercise' | 'howto' | null,
	xl?: boolean
	xs?: boolean
}>(), {
	xl: false,
	xs: false
})

const iconType = computed(() => {
	if (props.post === null || typeof props.post === 'string') {
		return props.post
	}

	return props.post.type
})

const revise = computed(() => {
	if (props.post === null) return false
	if (typeof props.post === "string") return false

	return props.post.revise

})
</script>

<template>
	<i
		:class="{
			'bi bi-book': !iconType,
			'bi bi-journal': iconType==='exercise',
			'bi bi-card-checklist': iconType==='howto',
			'text-xl': xl,
			'text-xs': xs,
			'text-red-500' : revise && $page.props.auth.can.admin
		}"
	/>
</template>

<style scoped>

</style>
