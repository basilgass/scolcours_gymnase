<script setup lang="ts">

import {usePage} from "@inertiajs/vue3"
import ScButton from "@/Components/Ui/Button/scButton.vue"

withDefaults(defineProps<{
	xs?: boolean
}>(), {
	xs: false
})
const themes = usePage().props.themes
const theme = defineModel<number>()

const emits = defineEmits<{
	change: [value: number]
}>()

function setTheme(id: number) {
	theme.value = id === theme.value ? 0 : id
	emits('change', theme.value)
}

</script>

<template>
	<div class="flex flex-wrap gap-3 w-full items-center">
		<sc-button
			v-for="item in themes"
			:key="item.id"
			:theme="item.id"
			:xs
			:outline="+theme!==+item.id"
			@click="setTheme(item.id)"
		>
			{{ item.title }}
		</sc-button>
	</div>
</template>


