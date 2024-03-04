<!--<info>
parameters: {name}(x),f (for fundamuntal), a (for asymptote), b (for bottom)

code: rational fraction
</info>-->
<script setup lang="ts">

import { computed, ref } from "vue"
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"

const props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

const probabilityTree = computed(()=>{
	return {
		parameters: params.value,
		code: code.value
	}
})
</script>
<template>
	<pi-probability-tree
		:tree-params="probabilityTree.parameters"
		:tree-data="probabilityTree.code"
	/>
</template>
