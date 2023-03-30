<info>
parameters: {name}(x),f (for fundamuntal), a (for asymptote), b (for bottom)

code: rational fraction
</info>
<template>
	<pi-euclidian
		:fx="euclidian.fx"
		:name="euclidian.name"
		:fundamental="euclidian.fundamental"
		:asymptote="euclidian.asymptote"
		:at-bottom="euclidian.atBottom"
	/>
</template>
<info>

</info>
<script setup>

import {computed, ref} from "vue"
import PiEuclidian from "@/Components/Pi/PiEuclidian.vue"

let props = defineProps({
		illustration: {type: Object, required: true}
	}),
	params = ref(props.illustration.parameters),
	code = ref(props.illustration.code)

let euclidian = computed(()=>{
	const config = params.value.split(",")
	return {
		fx: code.value,
		name: config.filter(x=>x.includes("(x)"))[0]||"f(x)",
		fundamental: config.indexOf("f")!==-1 || config.indexOf("fundamental")!==-1,
		asymptote: config.indexOf("a")!==-1 || config.indexOf("asymptote")!==-1,
		atBottom: config.indexOf("b")!==-1 || config.indexOf("bottom")!==-1
	}
})
</script>
