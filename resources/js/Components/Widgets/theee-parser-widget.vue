<script setup lang="ts">
import { WidgetPropsInterface } from "@/types/modelInterfaces"
import PiThreeParser from "../Pi/PiThreeParser.vue"

defineProps<{
	illustration: WidgetPropsInterface
}>()

</script>

<template>
	<PiThreeParser :draw="illustration" />
</template>


