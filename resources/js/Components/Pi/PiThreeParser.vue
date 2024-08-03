<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { usePiThreeScene } from './useThreeParser'

const threeContainer = ref(null)
const { parse, parseParameters } = usePiThreeScene(threeContainer)

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

onMounted(() => {
    // Load the configuration
    parseParameters(props.draw.parameters)

    // Load the code
    parse(props.draw.code)
})

watch(() => props.draw.parameters, () => {
    // Watch changes from "inside"
    parseParameters(props.draw.parameters)
})
watch(() => props.draw.code, () => {
    // Watch changes from "inside"
    parse(props.draw.code)
})
</script>
<template>
    <div>
        <div ref="threeContainer" class="aspect-[4/3]" />
    </div>
</template>