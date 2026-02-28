<script setup lang="ts">

import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"

defineProps<{
	challenge: ChallengeInterface,
	maxLevels: number,
	score?: ScoreInterface<ScoreChallengeDataInterface>
}>()

const emits = defineEmits(["start"])

</script>

<template>
	<article class="flex flex-col gap-3">
		<!-- Description du challenge -->
		<div class="grid grid-cols-3 gap-3 w-[30em] mx-auto">
			<div
				class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
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
				class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-chevron-double-up" />
					<div class="text-3xl">
						{{ maxLevels }}
					</div>
					<div class="text-sm text-gray-400">
						niveaux
					</div>
				</div>
			</div>

			<div
				class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
			>
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-clock" />
					<div class="text-3xl">
						{{ challenge.duration }}
					</div>
					<div class="text-sm text-gray-400">
						durée (min)
					</div>
				</div>
			</div>
		</div>

		<!-- Bouton pour commencer -->
		<sc-button
			theme
			class="min-w-[20em] mx-auto py-4 text-2xl hover:scale-105 transition-all"
			@click="emits('start')"
		>
			Commencer le challenge
		</sc-button>

		<!-- Résultat du challenge pour l'utilisateur -->
		<div class="min-w-[20em] mx-auto">
			<h3 class="uppercase text-xl font-extralight text-center mt-5 my-2">
				résultats
			</h3>

			<div class="grid w-full gap-4 grid-cols-2">
				<div
					class="bg-content aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow-sm"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase ">
							score
						</h4>
						<div class="text-3xl">
							{{ score?.data.current_score }}
						</div>
						<div class="text-sm">
							meilleur: {{ score?.score }}
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
