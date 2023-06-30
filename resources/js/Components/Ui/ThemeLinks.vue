<!--
Génération des liens pour les themes.
-->
<template>
	<Link
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
	</Link>
</template>
<script setup>

import {usePage} from "@inertiajs/vue3"
import {computed} from "vue"

let emit = defineEmits(["ClickNavigationLinks"])
let enabledThemes = computed(()=>{
	return usePage().props.themes.filter(theme=>theme.enabled)
})

</script>
