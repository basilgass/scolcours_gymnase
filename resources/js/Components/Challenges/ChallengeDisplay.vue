<script lang="ts" setup>
// Affiche un challenge, avec la "selection" (game, training)
import ChallengeGame from "@/Components/Challenges/ChallengeGame.vue"
import ChallengeTraining from "@/Components/Challenges/ChallengeTraining.vue"
import {ChallengeInterface} from "@/types/modelInterfaces"

defineProps<{
	challenge: ChallengeInterface,
	selector: number,
}>()

</script>

<template>
	<section>
		<div class="scolcours-container">
			<challenge-game
				v-if="selector===0"
				:challenge="challenge"
			/>

			<challenge-training
				v-else
				:generator="challenge.generators[selector-1]"
				:key="challenge.generators[selector-1].slug"
			/>
		</div>
	</section>
</template>
