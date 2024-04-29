<!--<info>
parameters: {name}(x),f (for fundamuntal), a (for asymptote), b (for bottom)

code: rational fraction
</info>-->
<script setup lang="ts">

import { computed } from "vue"
import PiEuclidian from "@/Components/Pi/PiEuclidian.vue"

const props = defineProps({
		illustration: {type: Object, required: true}
	})

const euclidian = computed(()=>{
	const config = props.illustration.parameters.split(",")
	return {
		fx: props.illustration.code,
		name: config.filter(x=>x.includes("(x)"))[0]||"f(x)",
		fundamental: config.indexOf("f")!==-1 || config.indexOf("fundamental")!==-1,
		asymptote: config.indexOf("a")!==-1 || config.indexOf("asymptote")!==-1,
		atBottom: config.indexOf("b")!==-1 || config.indexOf("bottom")!==-1
	}
})
</script>
<template>
	<pi-euclidian
		:fx="euclidian.fx"
		:name="euclidian.name"
		:fundamental="euclidian.fundamental"
		:asymptote="euclidian.asymptote"
		:at-bottom="euclidian.atBottom"
		class="max-w-lg mx-auto"
	/>
</template>
<info>

</info>
