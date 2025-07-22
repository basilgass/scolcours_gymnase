<!--
Génération des liens pour les themes.
-->
<script
	setup
	lang="ts"
>

import { usePage } from "@inertiajs/vue3"
import { computed } from "vue"

interface ThemeLinks {
	slug: string
	title: string
	icon: string
	route?: string
}

defineProps<{
	links?: ThemeLinks[]
}>()

const emit = defineEmits(["ClickNavigationLinks"])
const enabledThemes = computed<ThemeLinks[]>(() => {
	return Object.values(usePage().props.themes).filter(theme => theme.enabled)
})

</script>
<template>
	<InertiaLink
		v-for="theme of enabledThemes"
		:key="`anchor-${theme.slug}`"
		:href="route('theme', theme.slug)"
		class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
		@click="emit('ClickNavigationLinks')"
	>
		<i
			:class="`${theme.icon}`"
			class="mr-2"
		/>{{ theme.title }}
	</InertiaLink>
	<InertiaLink
		v-for="theme of links"
		:key="`anchor-${theme.slug}`"
		:href="route(theme.route??'404')"
		class="block transition duration-300 hover:translate-x-2 px-0 md:px-4 py-1"
		@click="emit('ClickNavigationLinks')"
	>
		<i
			:class="`${theme.icon}`"
			class="mr-2"
		/>{{ theme.title }}
	</InertiaLink>
</template>
