<script setup lang="ts">

import {kbrdStudyButtons, studyButtonsKeysType} from "@/Components/Keyboards/KeayboardHelpers/KeyboardStudyHelpers.ts"

const props = withDefaults(defineProps<{
	button: studyButtonsKeysType,
	count?: number
}>(), {
	count: 0
})

</script>

<template>
	<button class="flex gap-2 rounded bg-action cursor-pointer border  px-2 py-1">
		<div v-if="count>0">
			{{ count }}
		</div>
		{{ kbrdStudyButtons[button].label }}
	</button>
</template>

<style scoped>

</style>
