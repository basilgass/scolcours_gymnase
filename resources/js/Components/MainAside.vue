<!--
Menu latéral, avec les thèmes
-->
<script setup lang="ts">
import LogoutButton from "@/Components/Ui/LogoutButton.vue"
import ThemeLinks from "@/Components/Ui/ThemeLinks.vue"
import { inject } from "vue"

const showAside = inject('showAside', false)
</script>
<template>
	<aside>
		<transition name="fade">
			<div
				v-show="showAside"
				class="fixed top-0 left-0 w-full h-full bg-black/60 z-50"
				@click="showAside=false"
			/>
		</transition>
		<transition name="slide-fade-right">
			<div
				v-cloak
				v-show="showAside"
				class="fixed top-0 right-0 w-full z-50 sm:w-60 bg-black min-h-screen text-white"
			>
				<div class="space-y-1 py-2 text-sm">
					<div class="relative">
						<i
							class="absolute top-0 right-4 text-lg  text-gray-500 hover:text-white transition duration-300 bi bi-x-circle cursor-pointer"
							@click="showAside=false"
						/>
						<Link
							class="text-lg mt-5 px-4"
							:href="route('home')"
						>
							ScolCours
						</Link>
					</div>

					<Link
						:href="route('home')"
						class="block transition duration-300 hover:translate-x-2 px-4 py-1"
						@click="showAside=false"
					>
						accueil
					</Link>
					<hr>
					<ThemeLinks @click-navigation-links="showAside=false" />
					<hr>
					<div v-if="$page.props.auth.user">
						<Link
							v-admin
							as="button"
							class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
							:href="route('admin')"
							@click="showAside=false"
						>
							administration
						</Link>
						<Link
							v-admin
							as="button"
							class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
							:href="route('dev.index')"
							@click="showAside=false"
						>
							développement
						</Link>
						<LogoutButton class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1" />
					</div>
					<Link
						v-else
						as="button"
						class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
						:href="route('login')"
						@click="showAside=false"
					>
						se connecter
					</Link>
				</div>
			</div>
		</transition>
	</aside>
</template>

