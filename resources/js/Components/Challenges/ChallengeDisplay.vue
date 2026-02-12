<script lang="ts" setup>
// Affiche un challenge, avec la "selection" (game, training)
import ChallengeGame from "@/Components/Challenges/ChallengeGame.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
import {ChallengeGameState, ChallengeInterface} from "@/types/modelInterfaces"

defineProps<{
	challenge: ChallengeInterface,
	selector: number,
}>()

const emits = defineEmits<{
	stateChange: [value: ChallengeGameState]
}>()

</script>

<template>
	<section>
		<div class="scolcours-container">
			<suspense v-if="selector===0">
				<challenge-game
					:challenge="challenge"
					@state-change="emits('stateChange', $event)"
				/>
			</suspense>
			<suspense v-else>
				<challenge-training
					:key="challenge.generators[selector-1].slug"
					:generator="challenge.generators[selector-1]"
				/>
			</suspense>
		</div>
	</section>
</template>
