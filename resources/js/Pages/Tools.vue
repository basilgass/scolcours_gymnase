<template>
	<!-- Title -->
	<div class="flex justify-between items-baseline mb-4">
		<div>
			<ArticleTitle title="Outils" />
			<Link
				v-if="toolSlug!==''"
				:href="`/tools/${toolSlug}`"
			>
				{{ toolName }}
			</Link>
		</div>
		
		<button
			v-if="toolSlug"
			@click="toolSlug=''"
		>
			Tous les outils
		</button>
	</div>
	
	<div v-if="!toolSlug">
		<form-input
			label="Sélectionner l'outils"
			name="tools"
		/>
		
		<!-- List of all tools -->
		<table class="w-full my-5">
			<tr
				v-for="tool of $page.props.tools"
				:key="tool.slug"
				class="odd:bg-white hover:bg-amber-100"
				@click="toolSlug=tool.slug"
			>
				<td class="pl-3 py-2">
					<h2 class="text-lg">
						{{ tool.title }}
					</h2>
					<div class="text-sm text-gray-400">
						{{ tool.slug }}
					</div>
				</td>
				<td class="py-2 align-text-top">
					{{ tool.body }}
				</td>
			</tr>
		</table>
	</div>

	<keep-alive>
		<component :is="toolComponents[toolSlug]" />
	</keep-alive>
</template>
<script>
import LayoutMain from '@/Pages/Shared/LayoutMain'

export default {
	layout: LayoutMain
}
</script>
<script setup>
import FormInput from '@/Components/Form/FormInput'
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import ArticleTitle from '@/Components/Ui/ArticleTitle'
import { Inertia } from '@inertiajs/inertia'

let toolSlug = ref(null)

const props = defineProps({
	tools: {type: Object, default: ()=>{}},
	tool: {type: Object, default: ()=>{}}
})

let toolComponents = []
for(let tool of props.tools){
	toolComponents[tool.slug] = defineAsyncComponent(
		()=>import(`@/Components/Tools/${tool.slug}`)
	)
}

let toolName = computed(()=>{
	if(toolSlug.value===''){return ''}
	for(let tool of props.tools){
		if(tool.slug===toolSlug.value){
			return tool.title
		}
	}
	return ''
})
onMounted(()=> {
	if(props.tool !== null && props.tool.slug !== '') {
		toolSlug.value = props.tool.slug
	}
})
</script>

