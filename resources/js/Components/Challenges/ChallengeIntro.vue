<!--
Composant d'introduction du challenge, avec la configuration actuelle
nombre de vies, niveaux de difficultés, temps et les résultats courants

Pour l'admin, contient également les liens vers les résultats par teams.
-->
<template>
	<div
		class="grid place-items-center"
	>
		<div class="flex flex-col items-center gap-3 bg-white p-10 rounded-lg">
			<!-- Description du challenge -->
			<div class="w-full space-y-2">
				<div class="flex justify-between w-full">
					<div>Nombre de vies</div>
					<div>{{ challenge.lives }}</div>
				</div>

				<div class="flex justify-between w-full">
					<div>Niveaux de diffcultés</div>
					<div>{{ challenge.maxLevel }}</div>
				</div>
				<div
					v-if="challenge.duration > 0"
					class="flex justify-between w-full"
				>
					<div>Temps</div>
					<div>{{ challenge.duration }}</div>
				</div>
			</div>

			<!-- Bouton pour commencer -->
			<button
				v-theme.bg
				class="btn btn-xl hover:scale-110 transition-all"
				@click="emits('start')"
			>
				Commencer le challenge
			</button>

			<!-- Résultat du challenge pour l'utilisateur -->
			<div class="w-full">
				<h3 class="uppercase text-center mt-5 my-2">
					résultats
				</h3>

				<div class="grid mx-auto gap-8 grid-cols-2">
					<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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
					<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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
				class="w-full mt-10 border-t"
			>
				<h3 class="uppercase py-3">
					Résultats
				</h3>
				<div class="flex flex-wrap gap-3">
					<Link
						v-for="team of props.teams"
						:key="team.id"
						as="button"
						class="btn bg-white"
						:href="route('teams.challenge', [team.name, props.challenge.slug])"
					>
						{{ team.name }}
					</Link>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>

const props = defineProps({
	challenge: {type: Object, required: true},
	teams: {type: Object, required: true}
})

const emits = defineEmits(["start"])

</script>
