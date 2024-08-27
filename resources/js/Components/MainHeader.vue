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
import type { ThemeInterface } from "@/types"
import { computed, inject, PropType, provide, Ref, ref } from "vue"

import { useDark, useToggle } from '@vueuse/core'
const isDark = useDark()
// TODO: Set dark mode to false by default for now
isDark.value = false
const toggleDark = useToggle(isDark)

const props = defineProps({
	theme: {
		type: Object as PropType<ThemeInterface>,
		default: () => {
			return { title: "Scolcours", slug: "main" }
		}
	},
})

const computedTheme = computed(() => {
	return props.theme ? props.theme : { title: "Scolcours", slug: "main" }
})

const showAside = ref(false),
	editMode = inject<Ref<boolean>>("editMode")

provide("showAside", showAside)

</script>
<template>
	<header
		v-theme.bg.text
		class="border-b border-black/30"
	>
		<MainAside />

		<div class="scolcours-container py-6 flex justify-between items-center">
			<div class="text-2xl md:text-3xl lg:text-5xl flex gap-5">
				<Link
					href="/"
					class="relative min-w-[1em]"
				>
				<i class="absolute inset bi bi-house cursor-pointer" />
				<i
					class="absolute inset bi bi-house-fill cursor-pointer text-transparent hover:text-white transition-all duration-500" />
				</Link>

				<Link
					:href="computedTheme.slug === 'main' ? `/` : `/${computedTheme.slug}`"
					class="hover:scale-110 transition-all"
				>
				{{ computedTheme.title }}
				</Link>
			</div>

			<div class="flex gap-8 items-center">
				<div
					v-admin
					@click="toggleDark()"
					class="hover:-rotate-[120deg] duration-500 cursor-pointer"
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
			<div class="scolcours-container flex justify-between items-baseline">
				<div>
					<Link
						:href="route('admin')"
						class="text-xs text-white uppercase"
					>
					administrateur
					</Link>
				</div>
				<button
					:class="editMode ? 'bg-white/40' : ''"
					class="btn btn-xs hover:text-black"
					title="Ctrl+Alt+A"
					@click="editMode = !editMode"
				>
					<span v-show="editMode">
						<i class="bi bi-pencil mr-2" />
						<span class="hidden md:inline"> édition activée </span>
					</span>
					<span v-show="!editMode">
						<i class="bi bi-pencil mr-2" />
						<span>activer l'édition</span></span>
				</button>
			</div>
		</div>
	</header>
</template>
