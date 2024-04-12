<script setup lang="ts">
import type { IllustrationInterface } from "@/types/modelInterfaces"
import { PropType } from "vue"

let props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
})
</script>

<template>
	<img
		:src="'\\storage\\' + props.illustration.code"
		alt="image non disponible"
	>
</template>

<style scoped>

</style>
