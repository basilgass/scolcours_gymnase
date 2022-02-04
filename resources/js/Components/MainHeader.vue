<template>
	<header
		class="shadow text-white"
		:class="`scolcours-${theme.slug}`"
	>
		<MainAside />
		<div
			class="scolcours-container py-6
				flex justify-between items-center"
		>
			<div class="text-3xl">
				<i
					class="bi bi-list cursor-pointer mr-2"
					@click="showAside=!showAside"
				/>
				<a :href="theme.slug==='main'?`/`:`/${theme.slug}`">
					{{ theme.title }}
				</a>
			</div>
			
			<div>
				<div v-if="$page.props.auth.user">
					<div
						class="relative cursor-pointer"
						@click="showMenu = !showMenu"
					>
						{{ $page.props.auth.user.name }}
						<div
							v-if="showMenu"
							class="w-40
						flex flex-col text-left space-y-1 py-2
						absolute top-5 -right-1 bg-white text-gray-800 border-gray-200 rounded shadow-lg"
						>
							<Link
								class="hover:bg-gray-100 px-3 py-2"
								href="/dashboard"
							>
								profil
							</Link>
							
							<LogoutButton class="hover:bg-gray-100 " />
						</div>
					</div>
				</div>
				<div v-else>
					<a href="/login">
						Se connecter
					</a>
				</div>
			</div>
		</div>
	</header>
</template>
<script setup>
import { ref } from 'vue'
import MainAside from '@/Components/MainAside'
import LogoutButton from '@/Components/Ui/LogoutButton'

defineProps({
	theme: Object
})

let showMenu = ref(false),
	showAside = ref(false)

defineExpose({
	showAside, showMenu
})


</script>
