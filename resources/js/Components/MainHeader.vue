<template>
	<header
		class="shadow text-white"
		:class="`bg-scolcours-${theme.slug}`"
	>
		<MainAside />

		<div
			class="scolcours-container py-6
				flex justify-between items-center"
		>
			<div class="text-3xl">
				<Link href="/">
					<i
						class="bi bi-house cursor-pointer mr-2"
					/>
				</Link>

				<Link :href="theme.slug==='main'?`/`:`/${theme.slug}`">
					{{ theme.title }}
				</Link>
			</div>

			<div class="flex gap-3">
				<div class="text-3xl">
					<i
						class="bi bi-list cursor-pointer mr-2"
						@click="showAside=!showAside"
					/>
				</div>

				<div
					v-if="$page.props.auth.user"
					class="flex gap-3"
				>
					<div v-admin>
						<button
							class="btn btn-xs hover:text-black"
							:class="editMode.enabled.value?'bg-white/40':''"
							@click="editMode.toggle()"
						>
							<span v-show="editMode.enabled.value"> <i class="bi bi-pencil mr-2" /> édition activée</span>
							<span v-show="!editMode.enabled.value"> <i class="bi bi-pencil mr-2" /> activer l'édition</span>
						</button>
					</div>

					<div
						class="relative cursor-pointer"
						@click="showMenu = !showMenu"
					>
						<span class="text-lg">{{ $page.props.auth.user.name }}</span>
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
import {inject, ref} from "vue"
import MainAside from "@/Components/MainAside"
import LogoutButton from "@/Components/Ui/LogoutButton"

defineProps({
	theme: Object
})

let showMenu = ref(false),
	showAside = ref(false),
	editMode = inject("editMode")

defineExpose({
	showAside, showMenu
})


</script>
