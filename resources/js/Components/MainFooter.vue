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
					Liens
				</h3>
			</div>

			<div class="md:mx-auto">
				<h3 class="text-lg font-semibold">
					Utilisateur
				</h3>

				<div v-if="$page.props.auth.user">
					<Link
						href="/dashboard"
						class="block"
					>
						{{ $page.props.auth.user.name }}
					</Link>

					<LogoutButton class="mt-10 px-0 py-0" />
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
