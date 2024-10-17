<script setup lang="ts">
import type { IllustrationInterface } from "@/types/modelInterfaces"
import { computed, PropType } from "vue"

let props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
})

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
