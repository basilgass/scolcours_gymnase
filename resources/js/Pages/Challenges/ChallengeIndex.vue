<script
	setup
	lang="ts"
>

import LayoutMain from "@/Layouts/LayoutMain.vue"
import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import ChallengeCard from "@/Components/Challenges/ChallengeCard.vue"
import {useStoreScore} from "@/stores/useStoreScore.ts"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	challenges: ChallengeInterface[]
}>()

useStoreScore().getScores("Challenge", props.challenges.map(x => x.id))
</script>
<template>
	<div>
		<h1 class="text-xl font-semibold">
			Challenges
		</h1>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
			<challenge-card
				v-for="challenge in challenges"
				:key="`challenge-${challenge.id}`"
				:challenge
			/>
		</div>
	</div>
</template>
