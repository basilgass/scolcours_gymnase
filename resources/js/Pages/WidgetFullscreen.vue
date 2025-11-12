<script lang="ts" setup>

import LayoutFullpage from "@/Layouts/LayoutFullpage.vue"
import {onMounted, useTemplateRef} from "vue"

defineOptions({layout: LayoutFullpage})
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
