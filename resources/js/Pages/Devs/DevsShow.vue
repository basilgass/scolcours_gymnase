<!--suppress ALL -->
<template>
	<!-- Title -->
	<div class="py-5">
		<h1 class="text-2xl">
			{{ props.dev }}
		</h1>
		<Link
			href="/dev"
			class="hover:pl-3 transition-all"
		>
			Retour
		</Link>
	</div>

	<component
		:is="component"
	/>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain.vue"

export default {
	layout: LayoutMain
}
</script>
<script setup>

import {defineAsyncComponent} from "vue"

const props = defineProps({
	dev: {type: String, required: true}
})

let component = defineAsyncComponent(
	()=>import(`@/Components/Devs/${props.dev}`)
)

</script>

