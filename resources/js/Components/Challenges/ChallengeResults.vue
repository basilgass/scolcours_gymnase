<!--
Affichage des résultats à la fin d'un challenge.
Permet de recommencer le challenge.
-->
<template>
	<footer>
		<div class="grid grid-cols-3 gap-6">
			<div
				class="col-span-2 bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Score</div>
				<div>{{ results.score }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Meilleures scores</div>
				<div>{{ Math.max(props.challenge.user.score, results.score) }} / {{ props.challenge.best.score }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Vie(s)</div>
				<div>{{ results.lives - results.death }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Erreur(s)</div>
				<div>{{ results.death }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Temps restant</div>
				<div>{{ results.time }}</div>
			</div>
		</div>

		<div class="min-h-[120px] grid place-items-center my-5">
			<button
				class="btn-success btn-xl hover:scale-110 transition-all"
				@click="emits('start')"
			>
				Recommencer
			</button>

			<button
				class="btn-success btn-xl hover:scale-110 transition-all"
				@click="emits('cancel')"
			>
				Fermer
			</button>
		</div>

		<div class="mt-5 border-t">
			<div class="pt-5 mb-5 text-xl">
				réponses données
			</div>
			<div class="space-y-2">
				<div
					v-for="(item, index) of results.answers"
					:key="`answer-${index}`"
					v-katex.auto="item.value"
					:class="
						item.result
							? 'border-green-700 bg-green-600/30'
							: 'border-red-700 bg-red-600/30'
					"
					class="p-3 border"
				/>
			</div>
		</div>
	</footer>
</template>

<script setup>

const emits = defineEmits(["start", "cancel"])
const props = defineProps({
	results: {type: Object, required: true},
	challenge: {type: Object, require: true}
})

</script>
