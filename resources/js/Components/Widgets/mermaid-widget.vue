<script
	lang="ts"
	setup
>
import {WidgetPropsInterface} from "@/types/modelInterfaces"
import {computed} from "vue"
import MermaidDiagram from "@/Components/MermaidDiagram.vue"
import type {MermaidConfig} from "mermaid"
import {MermaidEmits} from "@/Composables/useMermaidDispatcher.ts"

// REFACTOR : mermaid.js is huge...find smaller version, better version or custom version ?
const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const config = computed<Partial<MermaidConfig>>(() => {
	const data = props.illustration.parameters?.split(',') ?? []
	const theme = ['default', 'dark', 'forest', 'neutral'].includes(data[0]) ? data[0] : 'neutral'
	const look = ['classic', 'handDrawn', 'neo'].includes(data[1]) ? data[1] : 'classic'

	return {
		theme,
		look,
	} as MermaidConfig
})

const emits = defineEmits<MermaidEmits>()

function onNodeClick(node: string, event: MouseEvent){
	emits('nodeClick', node, event)
}

</script>

<template>
	<mermaid-diagram
		:content="props.illustration.code"
		:config
		@node-click="onNodeClick"
	/>
</template>


