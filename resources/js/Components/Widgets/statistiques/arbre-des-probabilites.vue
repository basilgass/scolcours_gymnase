<!--<info>
parameters: R=p|f|c/digits/s/d,B=p|f/digits,V=results values,S=sequences values (R: result, B: branches)

code: 1. (name: simple) [rootname\n]A,3,B,2,5[,*] -> A is three times, B is two times, number of throws 5, optional star if reusing
2. (name: custom) [rootname\n]A,3\n B,2\n C,3\n D,4\n E,2\n F,2
</info>-->
<script setup lang="ts">

import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import { WidgetInterface } from "@/types/modelInterfaces"

defineProps<{
	illustration: WidgetInterface
}>()


</script>
<template>
	<div>
		<pi-probability-tree
			:tree-params="illustration.parameters"
			:tree-data="illustration.code"
		/>
	</div>
</template>
