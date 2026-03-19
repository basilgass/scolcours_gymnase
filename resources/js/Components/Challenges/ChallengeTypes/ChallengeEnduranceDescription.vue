<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"

defineProps<{
	challenge: ChallengeInterface
}>()
</script>

<template>
	<div>
		<div class="flex justify-center gap-6">
			<div class="w-40 bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm">
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
		</div>

		<div>
			<div class="list-inside">
				<li>
					Pas de limite de temps.
				</li>
				<li>
					{{ challenge.lives }} vie{{ challenge.lives > 1 ? 's' : '' }} disponible{{ challenge.lives > 1 ? 's' : '' }}.
				</li>
			</div>
		</div>
	</div>
</template>

<style scoped>

</style>