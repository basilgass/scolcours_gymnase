<script setup lang="ts">

import { PropType } from "vue"
import { ChallengeInterface } from "@/types/modelInterfaces"
import { ChallengeGameInterface } from "@/Components/Challenges/ChallengeGame.vue"

defineProps({
	challenge: { type: Object as PropType<ChallengeInterface>, required: true },
	game: {type: Object as PropType<ChallengeGameInterface>, required: true}
})

</script>
<template>
	<div class="grid grid-cols-3">
		<div
			class="text-xl text-left"
		>
			<i class="bi bi-bar-chart mr-2" /> {{ game.score }}
		</div>
		<div class="mx-auto flex gap-1 items-center">
			<div
				v-for="i of challenge.maxLevel"
				:key="`score-${i}`"
			>
				<i
					v-theme.text
					class="text-xl"
					:class="{
						'bi bi-circle text-gray-400': i>game.level,
						'bi bi-circle-half': i===game.level,
						'bi bi-circle-fill': i<game.level
					}"
				/>
			</div>
		</div>
		<div class="text-lg text-right">
			<i class="bi bi-chevron-double-up" /> {{ game.levelScore }} / {{ challenge.nextLevelAfter }}
		</div>
	</div>
</template>
