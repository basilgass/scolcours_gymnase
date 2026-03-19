<script lang="ts" setup>
// Affiche un challenge, avec la "selection" (game, training)
import ChallengeGame from "@/Components/Challenges/ChallengeGame.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
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
		<div class="scolcours-container">
			<suspense v-if="selectedGenerator === null">
				<challenge-game
					:challenge="challenge"
					@state-change="emits('stateChange', $event)"
				/>
			</suspense>
			<suspense v-else>
				<challenge-training
					:key="selectedGenerator.slug"
					:generator="selectedGenerator"
				/>
			</suspense>
		</div>
	</section>
</template>