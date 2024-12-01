<script setup lang="ts">
import { WidgetInterface } from "@/types/modelInterfaces"
import { computed } from "vue"

const props = defineProps<{
	illustration: WidgetInterface
}>()


const imageSrc = computed(()=>{
	const code = props.illustration.code
	if (code.startsWith('data:image/')) {
		return code
	}else if(code.startsWith('@')){
		return code.substring(1)
	} else {
		return '\\storage\\' + code
	}
})
</script>

<template>
	<img
		:src="imageSrc"
		alt="image non disponible"
	>
</template>

<style scoped>

</style>
