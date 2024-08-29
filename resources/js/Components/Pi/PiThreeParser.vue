<script setup lang="ts">
import { onMounted, ref, watch } from "vue"
import { Pi3Draw } from "pithree/lib"
import katex from "katex"
import { useResizeObserver } from "@vueuse/core"

// Container for the three.js scene
const threeContainer = ref(null)
let PiDraw: Pi3Draw

const props = defineProps({
    draw: {
        type: Object,
        default: () => {
            return {
                code: "",
                parameters: ""
            }
        }
    },
})

useResizeObserver(threeContainer.value, () => {
    if (PiDraw) PiDraw.onResize()
})

onMounted(() => {
    PiDraw = new Pi3Draw(threeContainer.value, {
        parameters: props.draw.parameters,
        code: props.draw.code,
        converter: (str: string) => katex.renderToString(str, { throwOnError: false }),
    }).mount()
})

watch(() => props.draw.parameters, () => {
    // Watch changes from "inside"
    PiDraw.refreshLayout(props.draw.parameters)
})

watch(() => props.draw.code, () => {
    // Watch changes from "inside"
    PiDraw.refresh(props.draw.code)
})
</script>
<template>
	<div>
		<div
			ref="threeContainer"
			class="aspect-[4/3]"
		/>
	</div>
</template>
