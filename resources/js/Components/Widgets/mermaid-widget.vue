<script
	lang="ts"
	setup
>
import {WidgetPropsInterface} from "@/types/modelInterfaces"
import {computed} from "vue"
import VueMermaidString from 'vue-mermaid-string'

const props = defineProps<{
	illustration: WidgetPropsInterface
}>()

const options = computed<{
	theme: string
}>(() => {
	const data = props.illustration.parameters.split(',')
	const theme = ['default', 'dark', 'forest', 'neutral'].includes(data[0]) ? data[0] : 'neutral'
	const look = ['classic', 'handDrawn'].includes(data[1]) ? data[1] : 'classic'

	// if(theme==='base'){
	// TODO: Mermaid: handle custom color ?
	// 	return {
	// 		theme,
	// 		'themeVariables': {
	// 			'primaryColor': '#25bb70',
	// 			'primaryTextColor': '#fff',
	// 			'primaryBorderColor': '#7C0000',
	// 			'lineColor': '#F8B229',
	// 			'secondaryColor': '#006100',
	// 			'tertiaryColor': '#fff'
	// 		}
	// 	}
	// }

	return {
		theme,
		look,
	}
})
const pre = computed(() => {
	return props.illustration.code
})

</script>

<template>
	<vue-mermaid-string
		:key="JSON.stringify(options)"
		class="flex justify-center"
		:value="pre"
		:options
	/>
</template>


