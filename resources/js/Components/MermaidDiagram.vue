<script setup lang="ts">

import {ref, useTemplateRef, watchEffect} from "vue"
import mermaid, {MermaidConfig} from "mermaid"

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

const el = useTemplateRef<HTMLElement>('el')
const mermaidString = ref<string>("")

function genSvgId() {
	const max = 1000000
	return `mermaid-svg-${genId(max)}${genId(max)}`

	function genId(max: number) {
		return ~~(Math.random() * max)
	}
}


async function updateGraph(graphDefinition: string) {
	const id = genSvgId()
	const res = await mermaid.render(id, graphDefinition)
	mermaidString.value = res.svg
}

// init mermaid
watchEffect(() => {
	if (!el.value) {
		return
	}

	mermaid.initialize({
		startOnLoad: false,
		securityLevel: 'loose',
		...props.config
	})
})

// update graph
watchEffect(() => {
	if (!el.value) {
		return
	}

	if (props.content) {
		updateGraph(props.content)
	}
})
</script>

<template>
	<pre
		ref="el"
		class="mermaid flex justify-center"
		v-html="mermaidString"
	/>
</template>

<style scoped>

</style>
