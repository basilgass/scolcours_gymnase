<script setup lang="ts">

import {usePage} from "@inertiajs/vue3"

const themes = usePage().props.themes


const theme = defineModel<number>()
function setTheme(id: number) {
	theme.value = id === theme.value ? 0 : id
}

</script>

<template>
	<div class="flex flex-wrap gap-3 w-full">
		<button
			v-for="item in themes"
			:key="item.id"
			@click="setTheme(item.id)"
			v-theme.bg.text="item.id"
			class="btn btn-xs flex-1"
			:class="+theme===+item.id ? 'opacity-100' : 'opacity-50'"
		>
			{{ item.title }}
		</button>
	</div>
</template>

<style scoped>

</style>
