<script setup lang="ts">

defineProps<{
	maxLevels: number
	gameLevel: number
	gameLevelScore: number
	nextLevelAfter: number
}>()
</script>

<template>
	<div class="flex gap-1 items-center">
		<div
			v-for="i of maxLevels"
			:key="`star-${i}`"
		>
			<i
				v-theme.text
				class="text-xl"
				:class="{
					'bi bi-star text-gray-400': i > gameLevel,
					'bi bi-star': i === gameLevel && gameLevelScore < nextLevelAfter,
					'bi bi-star-fill': i < gameLevel || (i === gameLevel && gameLevelScore >= nextLevelAfter)
				}"
			/>
		</div>
	</div>
</template>