<script setup lang="ts">
import { PropType } from "vue"
import { IllustrationInterface } from "@/types/modelInterfaces"

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
