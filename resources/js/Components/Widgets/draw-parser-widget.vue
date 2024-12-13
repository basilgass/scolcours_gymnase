<script setup lang="ts">
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import { WidgetInterface } from "@/types/modelInterfaces"

defineProps<{
	illustration: WidgetInterface
}>()


</script>

<template>
	<pi-draw-parser
		class="dark:invert"
		:draw="illustration"
	/>
</template>

<style scoped>

</style>
