<!--
Affichage des résultats à la fin d'un challenge.
Permet de recommencer le challenge.
-->
<script lang="ts" setup>

import {ChallengeInterface, ScoreInterface} from "@/types/modelInterfaces"
import ScButton from "@/Components/Ui/scButton.vue"
import {ChallengeAnswerInterface, ChallengeGameInterface} from "@/types/challengeInterface.ts"
import {ScoreChallengeDataInterface} from "@/types/scoreInterfaces.ts"

const emits = defineEmits(["start", "cancel"])

defineProps<{
	challenge: ChallengeInterface,
	answers: ChallengeAnswerInterface[],	// utiliser par afficher la liste des réponses
	results: ChallengeGameInterface,
	score: ScoreInterface<ScoreChallengeDataInterface>
}>()

</script>

<template>
	<footer>
		<div class="grid grid-cols-3 gap-6">
			<div
				class="col-span-2 rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Score</div>
				<div>{{ results.score }}</div>
			</div>

			<div
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Meilleures score</div>
				<div>{{ Math.max(score.data.current_score, results.score) }} / {{ score.score }}</div>
			</div>

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

			<div
				class="rounded-xl border border-gray-200 bg-white shadow-sm text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Temps restant</div>
				<div>{{ Math.max(results.remainingTime - results.elapsedTime, 0) }} s</div>
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
