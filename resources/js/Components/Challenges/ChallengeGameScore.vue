<script setup lang="ts">
/**
 * Lorsque le challenge est en cours, affiche la barre supérieur avec les scores actuels.
 */

defineProps<{
	gameLevel: number,
	maxLevels: number,
	gameScore: number,
	gameLevelScore: number,
	nextLevelAfter: number
}>()

</script>
<template>
	<div class="grid grid-cols-3">
		<div
			class="text-xl text-left flex flex-col"
		>
			<div><i class="bi bi-bar-chart mr-2" /> {{ gameScore }}</div>
			<div class="text-xs">
				score
			</div>
		</div>
		<div class="mx-auto flex flex-col">
			<div class="flex gap-1 items-center">
				<div
					v-for="i of maxLevels"
					:key="`score-${i}`"
				>
					<i
						v-theme.text
						class="text-xl"
						:class="{
							'bi bi-star text-gray-400': i>gameLevel,
							'bi bi-star': i===gameLevel && gameLevelScore < nextLevelAfter,
							'bi bi-star-fill': i<gameLevel || (i===gameLevel && gameLevelScore >= nextLevelAfter)
						}"
					/>
				</div>
			</div>
			<div class="text-xs">
				niveau {{ gameLevel }}
			</div>
		</div>
		<div class="text-lg text-right flex flex-col">
			<div><i class="bi bi-chevron-double-up" /> {{ gameLevelScore }} / {{ nextLevelAfter }}</div>
			<div class="text-xs">
				{{ gameLevel === maxLevels ? 'niveau max' : 'prochain niveau' }}
			</div>
		</div>
	</div>
</template>
