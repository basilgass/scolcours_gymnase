<!--
En-tête principal, sensible au thème
-->
<script setup lang="ts">
import { inject, ref } from "vue"
import MainAside from "@/Components/MainAside.vue"
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"
import LogoutButton from "@/Components/Ui/LogoutButton.vue"
import { editModeInterface } from "@/types/index.js"

defineProps({
		theme: { type: Object, required: true },
	})

	const showMenu = ref(false),
		showAside = ref(false),
		editMode = inject<editModeInterface>("editMode")

	defineExpose({
		showAside,
		showMenu,
	})
</script>
<template>
	<header
		:class="`bg-scolcours-${theme.slug}`"
		class="shadow text-white"
	>
		<MainAside />

		<div class="scolcours-container py-6 flex justify-between items-center">
			<div class="text-lg md:text-xl lg:text-3xl flex gap-5">
				<Link
					href="/"
					class="relative min-w-[1em]"
				>
					<i class="absolute inset bi bi-house cursor-pointer" />
					<i
						class="absolute inset bi bi-house-fill cursor-pointer text-transparent hover:text-white transition-all duration-500"
					/>
				</Link>

				<Link
					:href="theme.slug === 'main' ? `/` : `/${theme.slug}`"
					class="hover:scale-110 transition-all"
				>
					{{ theme.title }}
				</Link>
			</div>

			<div class="flex gap-8 items-center">
				<!-- utilisateur connecté -->
				<div
					v-if="$page.props.auth.user"
					class="flex"
				>
					<dropdown-menu>
						<template #button>
							<span class="text-lg">
								<i class="bi bi-person-fill mr-1" />
								{{ $page.props.auth.user.fullname }}
							</span>
						</template>

						<Link
							:href="route('dashboard')"
							class="hover:bg-gray-100 px-3 py-2"
						>
							profil
						</Link>

						<LogoutButton class="hover:bg-gray-100" />
					</dropdown-menu>
				</div>
				<div v-else>
					<a href="/login"> Se connecter </a>
				</div>

				<!-- affichage du menu de côté -->
				<div class="text-3xl">
					<i
						class="bi bi-list cursor-pointer mr-2"
						@click="showAside = !showAside"
					/>
				</div>
			</div>
		</div>
		<!-- ligne administration -->
		<div
			v-admin
			class="bg-slate-600 py-3"
		>
			<div
				class="scolcours-container flex justify-between items-baseline"
			>
				<div>
					<Link
						:href="route('admin')"
						class="text-xs text-white uppercase"
					>
						administrateur
					</Link>
				</div>
				<button
					:class="editMode.enabled.value ? 'bg-white/40' : ''"
					class="btn btn-xs hover:text-black"
					title="Ctrl+Alt+A"
					@click="editMode.toggle()"
				>
					<span v-show="editMode.enabled.value">
						<i class="bi bi-pencil mr-2" />
						<span class="hidden md:inline"> édition activée </span>
					</span>
					<span v-show="!editMode.enabled.value">
						<i class="bi bi-pencil mr-2" />
						<span>activer l'édition</span></span>
				</button>
			</div>
		</div>
	</header>
</template>
