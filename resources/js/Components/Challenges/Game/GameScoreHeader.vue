<script setup lang="ts">

import GameLevelStars from "@/Components/Challenges/Game/GameLevelStars.vue"

defineProps<{
	score: number | string
	scoreLabel: string
	rightValue: number | string
	rightLabel: string
	maxLevels: number
	gameLevel: number
	gameLevelScore: number
	nextLevelAfter: number
}>()
</script>

<template>
	<div class="grid grid-cols-3">
		<div class="text-xl text-left flex flex-col">
			<div>
				<i class="bi bi-bar-chart mr-2" />{{ score }}
			</div>
			<div class="text-xs">
				{{ scoreLabel }}
			</div>
		</div>

		<div class="mx-auto flex flex-col items-center">
			<game-level-stars
				:max-levels
				:game-level
				:game-level-score
				:next-level-after
			/>
			<div class="text-xs">
				niveau {{ gameLevel }}
			</div>
		</div>

		<div class="text-lg text-right flex flex-col">
			<div>
				<i class="bi bi-chevron-double-up" />{{ rightValue }}
			</div>
			<div class="text-xs">
				{{ rightLabel }}
			</div>
		</div>
	</div>
</template>