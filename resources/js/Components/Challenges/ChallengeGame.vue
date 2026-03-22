<script lang="ts" setup>

import {ChallengeGameState, ChallengeInterface} from "@/types/modelInterfaces"
import ChallengeClassicGame from "@/Components/Challenges/ChallengeTypes/ChallengeClassicGame.vue"
import ChallengeChronoGame from "@/Components/Challenges/ChallengeTypes/ChallengeChronoGame.vue"
import ChallengeStreakGame from "@/Components/Challenges/ChallengeTypes/ChallengeStreakGame.vue"
import ChallengeBlitzGame from "@/Components/Challenges/ChallengeTypes/ChallengeBlitzGame.vue"
import ChallengeEnduranceGame from "@/Components/Challenges/ChallengeTypes/ChallengeEnduranceGame.vue"
import ChallengePrecisionGame from "@/Components/Challenges/ChallengeTypes/ChallengePrecisionGame.vue"

defineProps<{ challenge: ChallengeInterface }>()
defineEmits<{ stateChange: [value: ChallengeGameState] }>()
</script>

<template>
	<challenge-classic-game
		v-if="challenge.type === 'classic'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
	<challenge-chrono-game
		v-else-if="challenge.type === 'chrono'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
	<challenge-streak-game
		v-else-if="challenge.type === 'streak'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
	<challenge-blitz-game
		v-else-if="challenge.type === 'blitz'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
	<challenge-endurance-game
		v-else-if="challenge.type === 'endurance'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
	<challenge-precision-game
		v-else-if="challenge.type === 'precision'"
		:challenge
		@state-change="$emit('stateChange', $event)"
	/>
</template>
