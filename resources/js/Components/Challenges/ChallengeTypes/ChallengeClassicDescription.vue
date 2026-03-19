<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import {computed} from "vue"
import {humanTime} from "@/utils/challengeTime.ts"

const props = defineProps<{
	challenge: ChallengeInterface
}>()

const timeLabel = computed(() => humanTime(props.challenge.time_limit))
</script>

<template>
	<div>
		<div class="flex justify-center gap-6">
			<div
				class="w-40 bg-content aspect-square p-4
			rounded-xl border border-gray-200
			grid place-items-center shadow-sm"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-heart" />
					<div class="text-3xl">
						{{ challenge.lives }}
					</div>
					<div class="text-sm text-gray-400">
						vies
					</div>
				</div>
			</div>
			<div
				class="w-40 bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-clock" />
					<div class="text-3xl">
						{{ challenge.time_limit }}
					</div>
					<div class="text-sm text-gray-400">
						durée (min)
					</div>
				</div>
			</div>
		</div>

		<div>
			<div class="list-inside">
				<li>
					Obtenir un maximum de points en {{ timeLabel }}.
				</li>
				<li>
					{{ challenge.lives }} vie{{ challenge.lives > 1 ? 's' : '' }}
					disponible{{ challenge.lives > 1 ? 's' : '' }}.
				</li>
				<li>
					En cas d'erreur, le décompte repart à zéro à partir du niveau en cours.
				</li>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>
