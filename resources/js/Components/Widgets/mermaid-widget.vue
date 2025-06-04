<script
	lang="ts"
	setup
>
import {WidgetPropsInterface} from "@/types/modelInterfaces"
import {computed} from "vue"
import MermaidDiagram from "@/Components/MermaidDiagram.vue"
import type {MermaidConfig} from "mermaid"


// TODO: est-il possible de réduire la taille de vue-mermaid-string, en faisant ma propre version et en passant par un CDN ?
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

</script>

<template>
	<mermaid-diagram
		:content="props.illustration.code"
		:config
	/>
</template>


