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
import {computed, provide, ref} from "vue"
import {ThemeInterface} from "@/types/modelInterfaces.ts"
import ScButton from "@/Components/Ui/Button/scButton.vue";

const props = withDefaults(defineProps<{
	theme?: Partial<ThemeInterface>,
	hideAdmin?: boolean
}>(), {
	theme: () => {
		return {title: "Scolcours", slug: "main"}
	},
	hideAdmin: false
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
		v-theme.bg.text="computedTheme.slug"
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
							:href="route('users.dashboard')"
							class="hover:bg-gray-100 px-3 py-2"
						>
							profil
						</InertiaLink>

						<LogoutButton class="hover:bg-gray-100 px-3 py-2" />
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
			v-if="!hideAdmin"
			v-admin
			class="admin-content py-3"
		>
			<div class="scolcours-container flex justify-between items-baseline">
				<div>
					<sc-button
						:href="route('admin.index')"
						class="uppercase"
						xs
						type="admin"
						outline
					>
						administrateur
					</sc-button>
				</div>
				<sc-button
					type="admin"
					:outline="!editMode.enable"
					xs
					title="Ctrl+Alt+A"
					@click="editMode.toggle()"
				>
					<i class="bi bi-pencil mr-2" />
					{{ editMode.enable ? 'édition activée' : 'édition désactivée' }}
				</sc-button>
			</div>
		</div>
	</header>
</template>
