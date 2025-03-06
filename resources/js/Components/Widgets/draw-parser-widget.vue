<script setup lang="ts">
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import { WidgetPropsInterface } from "@/types/modelInterfaces"

defineProps<{
	illustration: WidgetPropsInterface
}>()


</script>

<template>
	<pi-draw-parser
		class="dark:bg-slate-600"
		:draw="illustration"
	/>
</template>


