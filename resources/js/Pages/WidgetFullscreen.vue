<script lang="ts" setup>

import {onMounted, useTemplateRef} from "vue"
import LayoutFullscreen from "@/Layouts/LayoutFullscreen.vue"

defineOptions({layout: LayoutFullscreen})
const root = useTemplateRef<HTMLElement>('root')

const key = 'scolcours.widgetFS'

onMounted(() => {
	const html = window.sessionStorage.getItem(key)

	if (html) {
		root.value.innerHTML = html
	}
})

</script>

<template>
	<div ref="root">
		<div class="font-code">
			PAS D'INFO A AFFICHER
		</div>
	</div>
</template>

<style scoped>

</style>
