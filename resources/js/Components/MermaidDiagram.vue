<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue"
import mermaid, {MermaidConfig} from "mermaid"
import {MermaidEmits, registerMermaidHandler, unregisterMermaidHandler} from "@/Composables/useMermaidDispatcher.ts"
import {useResizeObserver} from "@vueuse/core"

const props = withDefaults(defineProps<{
		content: string,
		config?: MermaidConfig
		resizeObserver?: boolean
	}>(),
	{
		config: () => {
			return {
				theme: 'forest',
				look: 'handDrawn'
			}
		},
		resizeObserver: false
	})

const emits = defineEmits<MermaidEmits>()

// Le composant dans lequel insérer le svg.
const el = useTemplateRef<HTMLElement>('el')

// L'id unique du svg
const svgId = ref<string>(genSvgId())

function genSvgId() {
	// TODO: Passer à nanoid ?
	const max = 1000000
	return `mermaid-svg-${genId(max)}`

	function genId(max: number) {
		return ~~(Math.random() * max)
	}
}


const diagram = computed<string>(() => {
	return props.content.replace(
		/^(\s*click\s+[^\s]+\s*)$/gm,
		`$1 mermaidClickDispatcher`,
	)
})

async function updateGraph(graphDefinition: string) {
	if (!graphDefinition) {
		return
	}

	// nettoie anciens handlers
	unregisterMermaidHandler(svgId.value)

	// Bind events.
	registerMermaidHandler(svgId.value, (nodeId: string, event: MouseEvent) => {
		emits('nodeClick', nodeId, event)
	})

	// Render
	const {svg, bindFunctions} = await mermaid.render(svgId.value, graphDefinition)
	el.value.innerHTML = svg
	bindFunctions?.(el.value)
}

// init mermaid
onMounted(() => {
	if (!el.value) {
		return
	}

	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'loose',
		...props.config
	})

	updateGraph(diagram.value)

	if (props.resizeObserver) {
		useResizeObserver(el, () => {
			updateGraph(diagram.value)
		})
	}
})

onUnmounted(() => {
	unregisterMermaidHandler(svgId.value)
})

watch(diagram, async () => {
	if (!el.value) {
		return
	}

	await updateGraph(diagram.value)
})


</script>

<template>
	<div
		ref="el"
		class="flex justify-center"
	/>
</template>
