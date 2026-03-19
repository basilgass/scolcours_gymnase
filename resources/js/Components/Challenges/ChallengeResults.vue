<!--
Affichage des résultats à la fin d'un challenge.
Permet de recommencer le challenge.
-->
<script lang="ts" setup>

import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterfaces.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"

const emits = defineEmits(["start", "cancel"])

defineProps<{
	challenge: ChallengeInterface,
	answers: ChallengeAnswerInterface[],	// utiliser par afficher la liste des réponses
	results: ChallengeGameInterface,
	score: ScoreInterface<ScoreChallengeDataInterface>,
	challengeType: string,
}>()

</script>

<template>
	<footer>
		<div class="grid grid-cols-3 gap-6">
			<!-- Score principal -->
			<div
				class="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>{{ challengeType === 'chrono' ? 'Temps' : (challengeType === 'streak' ? 'Streak' : 'Score') }}</div>
				<div>
					<template v-if="challengeType === 'chrono'">
						{{ Math.round(results.elapsedTime) }}s
					</template>
					<template v-else>
						{{ results.score }}
					</template>
				</div>
			</div>

			<!-- Meilleur résultat -->
			<div
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>{{ challengeType === 'chrono' ? 'Meilleur temps' : 'Meilleur score' }}</div>
				<div>
					<template v-if="challengeType === 'chrono'">
						{{ score.score > 0 ? Math.round(score.score) + 's' : '—' }}
					</template>
					<template v-else>
						{{ Math.max(score.data.current_score, results.score) }} / {{ score.score }}
					</template>
				</div>
			</div>

			<!-- Vies : masqué pour chrono et streak -->
			<div
				v-if="!['chrono', 'streak'].includes(challengeType)"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Vie(s)</div>
				<div>{{ results.lives - results.death }}</div>
			</div>

			<!-- Erreurs : masqué pour chrono et streak -->
			<div
				v-if="!['chrono', 'streak'].includes(challengeType)"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Erreur(s)</div>
				<div>{{ results.death }}</div>
			</div>

			<!-- Temps restant : classic, blitz, streak (si time_limit) -->
			<div
				v-if="!['endurance', 'chrono', 'streak'].includes(challengeType) && results.remainingTime > 0"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Temps restant</div>
				<div>{{ Math.max(Math.round(results.remainingTime - results.elapsedTime), 0) }} s</div>
			</div>

			<!-- Niveau atteint : endurance uniquement -->
			<div
				v-if="challengeType === 'endurance'"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Niveau atteint</div>
				<div>{{ results.level }}</div>
			</div>

			<!-- Reprises utilisées (dernier niveau) : precision -->
			<div
				v-if="challengeType === 'precision'"
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Reprises (dernier niveau)</div>
				<div>{{ results.levelDeaths }}</div>
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
					:class="answer.result?'bg-green-100/90 border-green-600':'bg-red-100/90 border-red-600'"
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
