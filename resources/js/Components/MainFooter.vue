<!--
Pied de page pour les pages principales.
-->
<script
	setup
	lang="ts"
>
import LogoutButton from "@/Components/Ui/LogoutButton.vue"
import ThemeLinks from "@/Components/Ui/ThemeLinks.vue"
import DarkModeSwitch from "@/Components/Ui/DarkModeSwitch.vue"

const langues = {
	italiano: 'it',
	english: 'en',
	espanol: 'es',
	deutsch: 'de',
}
</script>
<template>
	<div class="bg-slate-950 text-slate-300 px-10 mt-24">
		<div class="max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-5">
			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Plan du site
				</h3>
				<ThemeLinks
					:links="[{
						title: 'formulaire',
						slug: 'formulaire',
						icon: 'bi bi-table',
						route: 'formulas.index'
					}]"
				/>
			</div>

			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Liens
				</h3>

				<InertiaLink
					:href="route('decks.index')"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i class="mr-2 bi bi-wrench" /> decks
				</InertiaLink>

				<InertiaLink
					:href="route('theme', {theme: 'tools'})"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i class="mr-2 bi bi-wrench" /> boîte à outils
				</InertiaLink>

				<InertiaLink
					:href="route('bareme.show')"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i class="mr-2 bi bi-bar-chart" /> barème
				</InertiaLink>
				<InertiaLink
					:href="route('grapheur.show')"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i class="mr-2 bi bi-graph-up" /> grapheur
				</InertiaLink>
				<h3 class="text-lg mt-5 font-semibold">
					Langues
				</h3>
				<div class="space-x-4">
					<InertiaLink
						v-for="(name,langue) in langues"
						:href="route('voc.index', [langue])"
						class="inline-block transition duration-300 hover:translate-x-1"
					>
						<i class="mr-1 bi bi-translate" /> {{ langues[langue] }}
					</InertiaLink>
				</div>
			</div>

			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Utilisateur
				</h3>

				<div v-if="$page.props.auth.user">
					<InertiaLink
						:href="route('users.dashboard')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-person-fill" />{{ $page.props.auth.user.name }}
					</InertiaLink>
					<InertiaLink
						:href="route('courses.index')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-book" />cours
					</InertiaLink>
					<InertiaLink
						:href="route('quizzs.index')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-question" />quizz
					</InertiaLink>

					<InertiaLink
						v-if="$page.props.auth.can.admin"
						:href="route('admin.index')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-person-workspace" />administration
					</InertiaLink>

					<LogoutButton class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1 mt-4" />
				</div>
				<div v-else>
					<InertiaLink href="/login">
						Se connecter
					</InertiaLink>
				</div>

				<div
					class="mt-5"
					v-admin
				>
					<h3 class="text-lg font-semibold">
						Interface
					</h3>
					<dark-mode-switch />
				</div>
			</div>
		</div>

		<div class="pb-5 text-center text-sm text-slate-400 font-extralight">
			<span>Ce site est à usage mathématiques uniquement</span>
		</div>
	</div>
</template>
