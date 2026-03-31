<script
	setup
	lang="ts"
>
import "@/Layouts/LayoutProjection.vue"
import DarkModeSwitch from "@/Components/Ui/DarkModeSwitch.vue"
import {Head, Link as InertiaLink, usePage} from "@inertiajs/vue3"
import {computed} from "vue"
import {usePageTitle} from "@/Composables/usePageTitle"

const {title: pageTitle} = usePageTitle()

const user = computed(() => {
	if (usePage().props.auth?.user) {
		return usePage().props.auth.user
	}

	return null
})
</script>

<template>
	<Head :title="pageTitle" />
	<div class="min-h-screen relative">
		<header class="fixed top-0 left-0 w-full py-1 px-4 flex justify-between items-baseline">
			<InertiaLink :href="route('scolcours.index')">
				<i class="bi bi-house" /> Scolcours
			</InertiaLink>

			<div v-if="user">
				{{ user.fullname }}
			</div>
		</header>
		<footer
			v-admin
			class="bg-content
			w-full py-1 px-4
			flex justify-between items-baseline
			fixed bottom-0 left-0"
		>
			<InertiaLink
				class="uppercase"
				:href="route('admin.index')"
			>
				administration
			</InertiaLink>

			<dark-mode-switch />
		</footer>
		<main class="w-[100vw] h-[100vh]">
			<slot />
		</main>
	</div>
</template>
