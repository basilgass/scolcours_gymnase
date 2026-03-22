<script setup lang="ts">

import {ChallengeInterface} from "@/types/challengeInterfaces.ts"
import {computed} from "vue"
import {humanTime} from "@/utils/challengeTime.ts"

const props = defineProps<{
	challenge: ChallengeInterface
}>()

const timeLabel = computed(() => humanTime(props.challenge.time_limit))

const hasMissingConfig = computed(() =>
	props.challenge.levels.some(level =>
		level.generators.some(gen => !gen.config?.time_per_question)
	)
)
</script>

<template>
	<div>
		<div class="flex justify-center gap-6">
			<div
				class="w-40 bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
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
						durée (sec)
					</div>
				</div>
			</div>
		</div>

		<div>
			<div class="list-inside">
				<li>
					Temps limité par question.
				</li>
				<li>
					{{ challenge.lives }} vie{{ challenge.lives > 1 ? 's' : '' }}
					disponible{{ challenge.lives > 1 ? 's' : '' }}.
				</li>
				<li>
					La partie dure {{ timeLabel }} au total.
				</li>
			</div>
		</div>
	</div>

	<div
		v-if="hasMissingConfig"
		class="mt-4 flex gap-2 items-start rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-700"
	>
		<i class="bi bi-exclamation-triangle-fill shrink-0 mt-0.5" />
		<span>
			Ce challenge est mal configuré : certains générateurs n'ont pas de durée par question définie.
			Le timer blitz ne se déclenchera pas.
		</span>
	</div>
</template>

<style scoped>

</style>
