<script setup lang="ts">
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import type { IllustrationInterface } from "@/types/modelInterfaces"

defineProps<{
	illustration: IllustrationInterface
}>()


</script>

<template>
	<pi-draw-parser
		:draw="illustration"
	/>
</template>

<style scoped>

</style>
