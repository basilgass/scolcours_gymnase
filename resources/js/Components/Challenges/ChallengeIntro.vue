<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {IChallengeConfig} from "@/Composables/useChallenge.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import Card from "@/Components/Ui/Card.vue"

const props = defineProps<{
	challenge: ChallengeInterface,
	score?: ScoreInterface<ScoreChallengeDataInterface>,
	config: IChallengeConfig
}>()

const emits = defineEmits(["start"])

function display(v: number | undefined): string {
	if (v === undefined || v === null) return '—'

	return props.config.description.labelFormat(v)
}
</script>

<template>
	<article>
		<Card>
			<div class="flex flex-col gap-3 py-12 space-y-12 w-full">
				<!-- Description du challenge -->
				<div class="flex gap-6 justify-center">
					<template
						v-for="card in config.description.cards"
						:key="card.label"
					>
						<div
							v-theme.bg.text
							class="w-40 aspect-square p-4 rounded-xl
							border border-gray-200
							shadow-sm
							grid place-items-center"
						>
							<div class="text-center flex flex-col justify-between h-full">
								<i
									class="text-5xl"
									:class="card.icon"
								/>
								<div class="text-3xl">
									{{ card.value }}
								</div>
								<div class="text-sm ">
									{{ card.label }}
								</div>
							</div>
						</div>
					</template>
				</div>

				<!--		<markdown-it :text="config.description" />-->
				<!--		<challenge-description :challenge />-->

				<!-- Bouton pour commencer -->
				<sc-button
					type="primary"
					class="px-10 mx-auto py-4 text-2xl hover:scale-105 transition-all"
					@click="emits('start')"
				>
					Commencer le challenge
				</sc-button>
			</div>
		</Card>

		<!-- Résultat du challenge pour l'utilisateur -->
		<div
			v-if="score"
			class="min-w-[20em] mx-auto flex flex-col gap-3 mt-5"
		>
			<h3 class="uppercase text-xl font-extralight text-center">
				Dernière tentative
			</h3>
			<div
				v-if="score.attempts > 0"
				class="text-center text-sm"
			>
				{{ score.updated_at }}
			</div>

			<div class="flex gap-6 justify-center">
				<div
					class="bg-content w-40 aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase">
							{{ config.description.label }}
						</h4>
						<div class="text-3xl">
							{{ display(score.data.current_score) }}
						</div>
						<div class="text-sm">
							meilleur: {{ display(score.score) }}
						</div>
					</div>
				</div>
				<div
					class="bg-content w-40 aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase">
							niveau
						</h4>
						<div class="text-3xl">
							{{ score.data.current_level }}
						</div>
						<div class="text-sm">
							meilleur: {{ score.data.level }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Résultat du challenge - leaderboard -->
	</article>
</template>
