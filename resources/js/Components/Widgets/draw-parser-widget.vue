<script setup lang="ts">
import { PropType } from "vue"
import { IllustrationInterface } from "@/types/modelInterfaces"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"

const props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
})

</script>

<template>
	<pi-draw-parser
		:draw="props.illustration"
	/>
</template>

<style scoped>

</style>
