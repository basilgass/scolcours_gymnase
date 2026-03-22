<script setup lang="ts">

import StatBar from "@/Components/Ui/StatBar.vue"
import {computed} from "vue"

const props = defineProps<{
	max: number
	value: number
	inverted?: boolean
}>()

const label = computed(() => {
	const remaining = Math.max(0, Math.round(props.max - props.value))
	return props.inverted ? `${remaining}s` : `${Math.round(props.value)}s`
})
</script>

<template>
	<stat-bar
		:max
		:value
		:inverted
		:bar-label="label"
		bar-label-class="text-gray-500"
	/>
</template>