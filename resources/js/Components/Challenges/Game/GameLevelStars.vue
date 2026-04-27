<script setup lang="ts">

import {IChallengeConfig} from "@/Composables/useChallenge.ts"
import {ChallengeGameInterface, ChallengeLevelInterface} from "@/types/challengeInterfaces.ts"
import {computed, ComputedRef, Ref} from "vue"
import {QuestionDynamicInterface} from "@/types/postInterfaces.ts"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"

const props = defineProps<{
	current: {
		id: Ref<number>,
		question: ComputedRef<QuestionDynamicInterface>,
		level: ComputedRef<ChallengeLevelInterface>,
		validate: (value: questionResultInterface) => void
	}
	config: IChallengeConfig
	results: ChallengeGameInterface
}>()

const maxLevels = computed(() => props.config.maxLevels)
const gameLevel = computed(() => props.results.level)
const gameLevelScore = computed(() => props.results.levelScore)
const nextLevelAfter = computed(() => props.current.level.value.points_to_pass)
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
					'bi bi-star text-gray-400!': i > gameLevel,
					'bi bi-star': i === gameLevel && gameLevelScore < nextLevelAfter,
					'bi bi-star-fill': i < gameLevel || (i === gameLevel && gameLevelScore >= nextLevelAfter)
				}"
			/>
		</div>
	</div>
</template>
