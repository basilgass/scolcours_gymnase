<!--
En-tête principal, sensible au thème
-->
<script
	setup
	lang="ts"
>
import MainAside from "@/Components/MainAside.vue"
import DropdownMenu from "@/Components/Ui/DropdownMenu.vue"
import LogoutButton from "@/Components/Ui/LogoutButton.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"

import {ThemeInterface} from "@/types/modelInterfaces.ts"

import {useDark, useToggle} from "@vueuse/core"
import {computed, PropType, provide, ref} from "vue"

// TODO: Set dark mode to false by default for now
const isDark = useDark()
// isDark.value = false
const toggleDark = useToggle(isDark)

const props = defineProps({
	theme: {
		type: Object as PropType<ThemeInterface>,
		default: () => {
			return {title: "Scolcours", slug: "main"}
		}
	},
})

const computedTheme = computed(() => {
	return props.theme ? props.theme : {title: "Scolcours", slug: "main"}
})

const showAside = ref(false)
provide("showAside", showAside)

const editMode = useStoreEditMode()

</script>
<template>
	<header
		v-theme.bg.text
		class="shadow"
	>
		<MainAside />

		<div
			class="scolcours-container py-6
		flex justify-between items-center"
		>
			<div class="text-2xl md:text-3xl lg:text-5xl flex gap-5">
				<InertiaLink
					href="/"
					class="relative min-w-[1em]"
				>
					<i class="absolute inset bi bi-house cursor-pointer" />
					<i
						class="absolute inset bi bi-house-fill cursor-pointer text-transparent hover:text-white transition-all duration-500"
					/>
				</InertiaLink>

				<InertiaLink
					:href="computedTheme.slug === 'main' ? `/` : `/${computedTheme.slug}`"
					class="hover:scale-110 transition-all"
				>
					{{ computedTheme.title }}
				</InertiaLink>
			</div>

			<div class="flex gap-8 items-center">
				<div
					@click="toggleDark()"
					class="hover:-rotate-[120deg] duration-500 cursor-pointer p-3"
				>
					<i :class="isDark ? 'bi bi-moon-fill' : 'bi bi-sun-fill'" />
				</div>
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

						<InertiaLink
							:href="route('dashboard')"
							class="hover:bg-gray-100 px-3 py-2"
						>
							profil
						</InertiaLink>

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
			<div class="scolcours-container flex justify-between items-baseline">
				<div>
					<InertiaLink
						:href="route('admin')"
						class="text-xs text-white uppercase"
					>
						administrateur
					</InertiaLink>
				</div>
				<button
					:class="editMode.enable ? 'bg-white/40' : ''"
					class="btn btn-xs hover:text-black"
					title="Ctrl+Alt+A"
					@click="editMode.toggle()"
				>
					<span v-show="editMode.enable">
						<i class="bi bi-pencil mr-2" />
						<span class="hidden md:inline"> édition activée </span>
					</span>
					<span v-show="!editMode.enable">
						<i class="bi bi-pencil mr-2" />
						<span>activer l'édition</span></span>
				</button>
			</div>
		</div>
	</header>
</template>
