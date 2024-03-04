<!--
Composant d'introduction du challenge, avec la configuration actuelle
nombre de vies, niveaux de difficultés, temps et les résultats courants

Pour l'admin, contient également les liens vers les résultats par teams.
-->
<script setup lang="ts">

const props = defineProps({
	challenge: {type: Object, required: true},
	teams: {type: Object, required: true}
})

const emits = defineEmits(["start"])

</script>

<template>
	<div class="flex flex-col gap-3 bg-gray-50 px-10 py-10 max-w-[40em] mx-auto border border-gray-400">
		<!-- Description du challenge -->
		<div class="max-w-[15em] w-full mx-auto flex flex-col gap-3 mb-5 text-lg">
			<div class="flex justify-between w-full">
				<div><i class="bi bi-heart mr-2" />Nombre de vies</div>
				<div>{{ challenge.lives }}</div>
			</div>

			<div class="flex justify-between w-full">
				<div><i class="bi bi-chevron-double-up mr-2" />Niveaux de diffcultés</div>
				<div>{{ challenge.maxLevel }}</div>
			</div>
			<div
				v-if="challenge.duration > 0"
				class="flex justify-between w-full"
			>
				<div><i class="bi bi-clock mr-2" />Temps (min)</div>
				<div>{{ challenge.duration }}</div>
			</div>
		</div>

		<!-- Bouton pour commencer -->
		<button
			v-theme.btn.text
			class="px-6 py-4 text-2xl hover:scale-105 transition-all"
			@click="emits('start')"
		>
			Commencer le challenge
		</button>

		<!-- Résultat du challenge pour l'utilisateur -->
		<div class="max-w-[20em] mx-auto w-full">
			<h3 class="uppercase text-xl font-extralight text-center mt-5 my-2">
				résultats
			</h3>

			<div class="grid w-full gap-4 grid-cols-2">
				<div
					class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase ">
							score
						</h4>
						<div class="text-3xl">
							{{ props.challenge.user.score }}
						</div>
						<div class="text-sm">
							meilleur: {{ props.challenge.best.score }}
						</div>
					</div>
				</div>
				<div
					class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow"
				>
					<div class="text-center flex flex-col justify-between h-full">
						<h4 class="text-xl uppercase">
							niveau
						</h4>
						<div class="text-3xl">
							{{ props.challenge.user.level }}
						</div>
						<div class="text-sm">
							meilleur: {{ props.challenge.best.level }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Gestion administrateur -->
		<div
			v-admin
			class="mt-10 border-t -mx-10 px-10"
		>
			<h3 class="uppercase py-3 font-extralight">
				Résultats
			</h3>
			<div class="flex flex-wrap gap-3">
				<Link
					v-for="team of props.teams"
					:key="team.id"
					:href="route('teams.challenge', [team.name, props.challenge.slug])"
					as="button"
					class="btn bg-white"
				>
					{{ team.name }}
				</Link>
			</div>
		</div>
	</div>
</template>
