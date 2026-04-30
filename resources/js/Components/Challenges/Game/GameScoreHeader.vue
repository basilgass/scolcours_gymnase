<script setup lang="ts">

import GameLevelStars from "@/Components/Challenges/Game/GameLevelStars.vue"
import {IChallengeConfig} from "@/Composables/useChallenge.ts"
import {ChallengeGameInterface, ChallengeLevelInterface} from "@/types/challengeInterfaces.ts"
import {QuestionDynamicInterface} from "@/types/postInterfaces.ts"
import {ComputedRef, Ref} from "vue"
import {questionResultInterface} from "@/Components/Questions/QuestionInterface.ts"

defineProps<{
	current: {
		id: Ref<number>,
		question: ComputedRef<QuestionDynamicInterface>,
		level: ComputedRef<ChallengeLevelInterface>,
		validate: (value: questionResultInterface) => void
	}
	results: ChallengeGameInterface
	config: IChallengeConfig
}>()


</script>

<template>
	<div class="grid grid-cols-3">
		<div class="text-xl text-left flex flex-col">
			<div>
				{{ +results[config.description.display].toFixed(1) }}
			</div>
			<div class="text-xs">
				{{ config.description.label }}
			</div>
		</div>

		<div class="mx-auto flex flex-col items-center">
			<game-level-stars
				:current
				:config
				:results
			/>
			<div
				v-if="current.level.value.points_to_pass > results.levelScore"
				class="text-xs"
			>
				encore {{ current.level.value.points_to_pass - results.levelScore }} questions
			</div>
		</div>

		<div class="text-lg text-right flex flex-col">
			<div
				v-if="config.game.lives>0"
				class="flex gap-1 justify-end"
			>
				<template
					v-for="i of config.game.lives"
					:key="`heart-${i}`"
				>
					<i
						class="text-red-600"
						:class="{
							'bi bi-heart-fill': i > results.death,
							'bi bi-heart': i <= results.death
						}"
					/>
				</template>
			</div>
		</div>
	</div>
</template>
