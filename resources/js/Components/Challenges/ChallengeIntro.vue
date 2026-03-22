<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import ChallengeDescription from "@/Components/Challenges/ChallengeDescription.vue"

const props = defineProps<{
	challenge: ChallengeInterface,
	maxLevels: number,
	score?: ScoreInterface<ScoreChallengeDataInterface>,
	scoreLabel?: string,
	formatScore?: (v: number) => string,
}>()

const emits = defineEmits(["start"])

function display(v: number | undefined): string {
	if (v === undefined || v === null) return '—'
	return props.formatScore ? props.formatScore(v) : String(v)
}
</script>

<template>
	<article class="flex flex-col gap-3">
		<!-- Description du challenge -->
		<challenge-description :challenge />

		<!-- Bouton pour commencer -->
		<sc-button
			theme
			class="min-w-[20em] mx-auto py-4 text-2xl hover:scale-105 transition-all"
			@click="emits('start')"
		>
			Commencer le challenge
		</sc-button>

		<!-- Résultat du challenge pour l'utilisateur -->
		<div class="min-w-[20em] mx-auto flex flex-col gap-3 mt-5">
			<h3 class="uppercase text-xl font-extralight text-center">
				Dernière tentative
			</h3>
			<div
				v-if="score?.attempts > 0"
				class="text-center text-sm"
			>
				{{ score.updated_at }}
			</div>

			<div class="grid w-full gap-4 grid-cols-2">
				<div
					class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase">
							{{ scoreLabel ?? 'score' }}
						</h4>
						<div class="text-3xl">
							{{ display(score?.data.current_score) }}
						</div>
						<div class="text-sm">
							meilleur: {{ display(score?.score) }}
						</div>
					</div>
				</div>
				<div
					class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase">
							niveau
						</h4>
						<div class="text-3xl">
							{{ score?.data.current_level }}
						</div>
						<div class="text-sm">
							meilleur: {{ score?.data.level }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</article>
</template>