<template>
	<!-- Title -->
	<div class="py-5">
		<h1 class="text-2xl">
			{{ props.dev }}
		</h1>
		<Link
				class="hover:pl-3 transition-all"
				href="/dev"
		>
			Retour
		</Link>
	</div>

	<component :is="component"/>
</template>
<script lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup lang="ts">

import {computed, defineAsyncComponent} from "vue"

const props = defineProps({
	dev: {type: String, required: true}
})

let component = computed(() => {
	return defineAsyncComponent(() => import(/* @vite-ignore */`/resources/js/Components/Devs/${props.dev}.vue`))
})

</script>

