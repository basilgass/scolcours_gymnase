<script setup lang="ts">
import { PropType } from "vue"
import type { IllustrationInterface } from "@/types/modelInterfaces"
import PiThreeParser from "../Pi/PiThreeParser.vue"

const props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
})

</script>

<template>
	<PiThreeParser :draw="props.illustration" />
</template>

<style scoped></style>
