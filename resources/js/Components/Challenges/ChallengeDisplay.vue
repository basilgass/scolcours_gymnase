<script lang="ts" setup>
// Affiche un challenge, avec la "selection" (game, training)
import ChallengeGame from "@/Components/Challenges/ChallengeGame.vue"
import GeneratorDisplay from "@/Components/Challenges/GeneratorDisplay.vue"
import {ChallengeGameState, ChallengeInterface} from "@/types/modelInterfaces"
import {GeneratorInterface} from "@/types/challengeInterfaces.ts"

defineProps<{
	challenge: ChallengeInterface,
	selectedGenerator: GeneratorInterface | null,
}>()

const emits = defineEmits<{
	stateChange: [value: ChallengeGameState]
}>()

</script>

<template>
	<section>
		<suspense v-if="selectedGenerator === null">
			<challenge-game
				:challenge="challenge"
				@state-change="emits('stateChange', $event)"
			/>
		</suspense>
		<suspense v-else>
			<generator-display
				:key="selectedGenerator.slug"
				:generator="selectedGenerator"
			/>
		</suspense>
	</section>
</template>
