<script setup lang="ts">
import { WidgetInterface } from "@/types/modelInterfaces"
import PiThreeParser from "../Pi/PiThreeParser.vue"

defineProps<{
	illustration: WidgetInterface
}>()

</script>

<template>
	<PiThreeParser :draw="illustration" />
</template>

<style scoped></style>
