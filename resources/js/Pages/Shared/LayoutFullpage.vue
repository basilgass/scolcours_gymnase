<template>
	<div class="min-h-screen flex flex-col">
		<main class="container mx-auto flex-1">
			<slot />
		</main>
		
		<div class="bg-black text-white px-10">
			<div class="max-w-5xl mx-auto py-10 grid grid-cols-3">
				<div class="mx-auto">
					<h3 class="text-lg font-semibold">
						Plan du site
					</h3>
					<ThemeLinks />
				</div>
				
				<div class="mx-auto">
					<h3 class="text-lg font-semibold">
						Liens
					</h3>
				</div>
				
				<div class="mx-auto">
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
		</div>
	</div>
</template>

<script>
import ThemeLinks from '@/Components/Ui/ThemeLinks'
import LogoutButton from '@/Components/Ui/LogoutButton'

export default {
	name: 'LayoutFullpage',
	components: { LogoutButton, ThemeLinks }
}
</script>

