<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import {computed} from "vue"

const props = defineProps<{
	challenge: ChallengeInterface
}>()

const targetScore = computed(() =>
	props.challenge.levels.reduce((sum, level) => sum + level.points_to_pass, 0)
)
</script>

<template>
	<div>
		<div class="flex justify-center gap-6">
			<div class="w-40 bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm">
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-trophy" />
					<div class="text-3xl">
						{{ targetScore }}
					</div>
					<div class="text-sm text-gray-400">
						score cible
					</div>
				</div>
			</div>
		</div>

		<div>
			<div class="list-inside">
				<li>
					Atteindre {{ targetScore }} points le plus vite possible.
				</li>
				<li>
					Pas de limite de temps ni de vies.
				</li>
				<li>
					Le meilleur score correspond au temps le plus court.
				</li>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>