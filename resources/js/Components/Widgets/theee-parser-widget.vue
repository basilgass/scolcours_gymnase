<script setup lang="ts">
import type { IllustrationInterface } from "@/types/modelInterfaces"
import PiThreeParser from "../Pi/PiThreeParser.vue"

defineProps<{
	illustration: IllustrationInterface
}>()

</script>

<template>
	<PiThreeParser :draw="illustration" />
</template>

<style scoped></style>
