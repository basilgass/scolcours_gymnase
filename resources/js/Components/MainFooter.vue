<!--
Pied de page pour les pages principales.
-->
<template>
	<div class="bg-black text-white px-10 mt-24">
		<div class="max-w-5xl mx-auto py-10 grid grid-cols-1 md:grid-cols-3 gap-5">
			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Plan du site
				</h3>
				<ThemeLinks />
			</div>

			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Langues
				</h3>
				<Link
					:href="route('translation.index', ['italiano'])"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i
						class="mr-2 bi bi-translate"
					/> italiano
				</Link>
				<Link
					:href="route('translation.index', ['english'])"
					class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
				>
					<i
						class="mr-2 bi bi-translate"
					/> english
				</Link>
			</div>

			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Utilisateur
				</h3>

				<div v-if="$page.props.auth.user">
					<Link
						:href="route('dashboard')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-person-fill" />{{ $page.props.auth.user.name }}
					</Link>
					<Link
						:href="route('quizzs.index')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-question" />quizz
					</Link>

					<Link
						v-if="$page.props.auth.can.admin"
						:href="route('admin')"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
					>
						<i class="mr-2 bi bi-person-workspace" />administration
					</Link>

					<LogoutButton
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1 mt-10"
					/>
				</div>
				<div v-else>
					<Link href="/login">
						Se connecter
					</Link>
				</div>
			</div>
		</div>

		<div class="pb-5 text-center text-sm text-gray-400">
			<span>Ce site est à usage mathématiques uniquement</span>
		</div>
	</div>
</template>
<script>
import LogoutButton from "@/Components/Ui/LogoutButton"
import ThemeLinks from "@/Components/Ui/ThemeLinks"

export default {
	name: "MainFooter",
	components: {LogoutButton, ThemeLinks}
}
</script>
