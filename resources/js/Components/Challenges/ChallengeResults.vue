<template>
	<foote>
		<div class="grid grid-cols-3 gap-6">
			<div
				class="col-span-2 bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Score</div>
				<div>{{ score }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Meilleure score</div>
				<div>{{ localScore }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Vie(s)</div>
				<div>{{ lives - death }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Erreur(s)</div>
				<div>{{ death }}</div>
			</div>

			<div
				class="bg-white rounded text-xl md:text-2xl text-center p-2 md:p-10 flex flex-col justify-between gap-4"
			>
				<div>Temps restant</div>
				<div>{{ remainingTime }}</div>
			</div>
		</div>

		<div class="min-h-[120px] grid place-items-center my-5">
			<button
				class="btn-success btn-xl hover:scale-110 transition-all"
				@click="startChallenge"
			>
				Recommencer
			</button>
		</div>

		<div class="mt-5 border-t">
			<div class="pt-5 mb-5 text-xl">
				réponses données
			</div>
			<div class="space-y-2">
				<div
					v-for="(item, index) of listOfAnswers"
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
	</foote>
</template>

<script setup>
</script>
