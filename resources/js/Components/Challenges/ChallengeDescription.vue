<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import ChallengeClassicDescription from "@/Components/Challenges/ChallengeTypes/ChallengeClassicDescription.vue"
import ChallengeChronoDescription from "@/Components/Challenges/ChallengeTypes/ChallengeChronoDescription.vue"
import ChallengeStreakDescription from "@/Components/Challenges/ChallengeTypes/ChallengeStreakDescription.vue"
import ChallengeBlitzDescription from "@/Components/Challenges/ChallengeTypes/ChallengeBlitzDescription.vue"
import ChallengeEnduranceDescription from "@/Components/Challenges/ChallengeTypes/ChallengeEnduranceDescription.vue"
import ChallengePrecisionDescription from "@/Components/Challenges/ChallengeTypes/ChallengePrecisionDescription.vue"

defineProps<{
	challenge: ChallengeInterface
}>()
</script>

<template>
	<challenge-classic-description
		v-if="challenge.type === 'classic'"
		:challenge
	/>
	<challenge-chrono-description
		v-else-if="challenge.type === 'chrono'"
		:challenge
	/>
	<challenge-streak-description
		v-else-if="challenge.type === 'streak'"
		:challenge
	/>
	<challenge-blitz-description
		v-else-if="challenge.type === 'blitz'"
		:challenge
	/>
	<challenge-endurance-description
		v-else-if="challenge.type === 'endurance'"
		:challenge
	/>
	<challenge-precision-description
		v-else-if="challenge.type === 'precision'"
		:challenge
	/>
</template>

<style scoped>

</style>