<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { Pi3Draw } from "pithree/lib"
import katex from 'katex'
import { useResizeObserver } from '@vueuse/core';

// Container for the three.js scene
const threeContainer = ref(null)
let draw: Pi3Draw

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
    if (draw) draw.onResize()
})

onMounted(() => {
    draw = new Pi3Draw(threeContainer.value, {
        parameters: props.draw.parameters,
        code: props.draw.code,
        converter: (str: string) => katex.renderToString(str, { throwOnError: false }),
    }).mount()
})

watch(() => props.draw.parameters, () => {
    // Watch changes from "inside"
    draw.refreshLayout(props.draw.parameters)
})

watch(() => props.draw.code, () => {
    // Watch changes from "inside"
    draw.refresh(props.draw.code)
})
</script>
<template>
    <div>
        <div ref="threeContainer" class="aspect-[4/3]" />
    </div>
</template>