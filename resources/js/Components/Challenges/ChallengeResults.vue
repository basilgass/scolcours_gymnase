<!--
Affichage des résultats à la fin d'un challenge.
Les données sont normalisées par le composant de type — aucune condition sur challengeType ici.
-->
<script lang="ts" setup>

import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterfaces.ts"
import {ScoreInterface} from "@/types/modelInterfaces"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"
import {IChallengeConfig} from "@/Composables/useChallenge.ts"
import {computed} from "vue"

const emits = defineEmits(["start", "cancel"])

const props = defineProps<{
	answers: ChallengeAnswerInterface[],
	results: ChallengeGameInterface,
	score: ScoreInterface<ScoreChallengeDataInterface>,
	config: IChallengeConfig
}>()

const scoreLabel = computed(() => props.config.description.label)
const currentScoreDisplay = computed(() => props.config.description.labelFormat(props.score.data.current_score))
const bestScoreDisplay = computed(() => props.config.description.labelFormat(props.score.score))

// TODO: endurance et precision ont des extra-stats
// PRECISION : :extra-stats="[{label: 'Reprises (dernier niveau)', value: game.levelDeaths}]"
// ENDURANCE : :extra-stats="[{label: 'Niveau atteint', value: game.level}]"
const extraStats = computed<{ label: string, value: number }[]>(() => [])
</script>

<template>
	<footer>
		<div class="grid grid-cols-3 gap-6">
			<!-- Score principal -->
			<div
				class="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>{{ scoreLabel }}</div>
				<div>{{ currentScoreDisplay }}</div>
			</div>

			<!-- Meilleur résultat -->
			<div
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Meilleur {{ scoreLabel }}</div>
				<div>{{ bestScoreDisplay }}</div>
			</div>

			<!-- Vies + Erreurs : ne s'affiche que si c'est configuré avec des vies -->
			<template v-if="config.game.lives>0">
				<div
					class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
				>
					<div>Vie(s)</div>
					<div>{{ results.lives - results.death }}</div>
				</div>
				<div
					class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
				>
					<div>Erreur(s)</div>
					<div>{{ results.death }}</div>
				</div>
			</template>

			<!-- Temps restant -->
			<div
				v-if="config.timers.global"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Temps restant</div>
				<div>{{ Math.max(Math.round(results.remainingTime - results.elapsedTime), 0) }} s</div>
			</div>

			<!-- Stats supplémentaires spécifiques au type -->
			<div
				v-for="stat of extraStats"
				:key="stat.label"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>{{ stat.label }}</div>
				<div>{{ stat.value }}</div>
			</div>
		</div>

		<div class="flex gap-5 justify-center my-10">
			<sc-button
				xl
				class="hover:scale-110 transition-all"
				theme
				@click="emits('start')"
			>
				Recommencer
			</sc-button>

			<sc-button
				xl
				class="hover:scale-110 transition-all"
				theme
				@click="emits('cancel')"
			>
				Fermer
			</sc-button>
		</div>

		<div class="mt-5 border-t">
			<div class="pt-5 mb-5 text-xl">
				réponses données
			</div>
			<div class="space-y-2">
				<div
					v-for="(answer, id) of answers"
					:key="`answer-${id}`"
					class="relative px-3 py-1 border rounded"
					:class="answer.result ? 'bg-green-100/90 border-green-600' : 'bg-red-100/90 border-red-600'"
				>
					<div v-katex.auto.left="answer.question" />
					<div
						class="absolute top-0 right-1 text-gray-600 text-sm font-code"
						v-text="answer.answer"
					/>
				</div>
			</div>
		</div>
	</footer>
</template>
