<!--
En-tête principal, sensible au thème
-->
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
			<div class="text-lg md:text-xl lg:text-3xl">
				<Link href="/">
					<i
						class="bi bi-house cursor-pointer mr-2"
					/>
				</Link>

				<Link :href="theme.slug==='main'?`/`:`/${theme.slug}`">
					{{ theme.title }}
				</Link>
			</div>

			<div class="flex gap-8 items-center">
				<!-- utilisateur connecté -->
				<div
					v-if="$page.props.auth.user"
					class="flex"
				>
					<div
						class="relative cursor-pointer"
						@click="showMenu = !showMenu"
					>
						<span class="text-lg">
							<i class="bi bi-person-fill mr-1" />
							{{ $page.props.auth.user.name }}
						</span>
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

				<!-- affichage du menu de côté -->
				<div class="text-3xl">
					<i
						class="bi bi-list cursor-pointer mr-2"
						@click="showAside=!showAside"
					/>
				</div>
			</div>
		</div>
		<!-- ligne administration -->
		<div
			v-admin
			class="bg-slate-600 py-3"
		>
			<div class="scolcours-container flex justify-between items-baseline">
				<div>
					<Link
						class="text-xs text-white uppercase"
						:href="route('admin')"
					>
						administrateur
					</Link>
				</div>
				<button
					class="btn btn-xs hover:text-black"
					:class="editMode.enabled.value?'bg-white/40':''"
					@click="editMode.toggle()"
				>
					<span v-show="editMode.enabled.value"> <i class="bi bi-pencil mr-2" /> <span
						class="hidden md:inline"
					>édition activée</span></span>
					<span v-show="!editMode.enabled.value"> <i class="bi bi-pencil mr-2" /> <span>activer l'édition</span></span>
				</button>
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
