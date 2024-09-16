<!--
Composant d'introduction du challenge, avec la configuration actuelle
nombre de vies, niveaux de difficultés, temps et les résultats courants

Pour l'admin, contient également les liens vers les résultats par teams.
-->
<script
	setup
	lang="ts"
>

const props = defineProps({
	challenge: { type: Object, required: true },
	teams: { type: Object, required: true }
})

const emits = defineEmits(["start"])

</script>

<template>
	<article class="flex flex-col gap-3">
		<!-- Description du challenge -->
		<div class="grid grid-cols-3 gap-3 w-[30em] mx-auto">
			<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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

			<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
				<div class="text-center flex flex-col justify-between h-full">
					<i class="text-5xl bi bi-chevron-double-up" />
					<div class="text-3xl">
						{{ challenge.maxLevel }}
					</div>
					<div class="text-sm text-gray-400">
						niveaux
					</div>
				</div>
			</div>

			<div class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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
		<button
			v-theme.btn.text
			class="min-w-[20em] mx-auto py-4 text-2xl hover:scale-105 transition-all"
			@click="emits('start')"
		>
			Commencer le challenge
		</button>

		<!-- Résultat du challenge pour l'utilisateur -->
		<div class="min-w-[20em] mx-auto">
			<h3 class="uppercase text-xl font-extralight text-center mt-5 my-2">
				résultats
			</h3>

			<div class="grid w-full gap-4 grid-cols-2">
				<div
					class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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
					class="bg-white aspect-square p-4 rounded-xl border border-gray-200 grid place-items-center shadow">
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
			class="mt-10 border-t -mx-3 px-3"
		>
			<h3 class="uppercase py-3 font-extralight">
				Résultats
			</h3>
			<div class="flex flex-wrap gap-3">
				<InertiaLink
					v-for="team of props.teams"
					:key="team.id"
					:href="route('teams.challenge', [team.name, props.challenge.slug])"
					as="button"
					class="btn bg-white"
				>
					{{ team.name }}
				</InertiaLink>
			</div>
		</div>
	</article>
</template>
