<script setup lang="ts">

import {computed, onMounted, onUnmounted, ref, useTemplateRef, watch} from "vue"
import mermaid, {MermaidConfig} from "mermaid"
import {registerMermaidHandler, unregisterMermaidHandler} from "@/Composables/useMermaidDispatcher.ts"

const props = withDefaults(defineProps<{
		content: string,
		config?: MermaidConfig
	}>(),
	{
		config: () => {
			return {
				theme: 'forest',
				look: 'handDrawn'
			}
		}
	})

const emits = defineEmits<{
	nodeClick: [id: string]
}>()

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

	console.log(graphDefinition)

	// nettoie anciens handlers
	unregisterMermaidHandler(svgId.value)

	// Bind events.
	registerMermaidHandler(svgId.value, (nodeId) => {
		emits('nodeClick', nodeId)
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
