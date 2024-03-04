<script lang="ts" setup>

import { computed } from "vue"
import { getModule, MODULE_TYPES } from "@/scolcours"
import LayoutMain from "@/Layouts/LayoutMain.vue"

defineOptions({ layout: LayoutMain })

const props = defineProps({
    dev: {type: String, required: true}
})

const component = computed(() => {
    return getModule(props.dev, MODULE_TYPES.DEV)
})

</script>

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

	<component :is="component" />
</template>

