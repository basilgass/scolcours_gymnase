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
			<suspense v-if="selector===0">
				<challenge-game
					:challenge="challenge"
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
