<template>
	<form-input
			label="Sélectionner l'outils"
			name="tools"
		/>

	<table class="w-full my-5">
		<tr
				v-for="tool of $page.props.tools"
				:key="tool.slug"
				class="odd:bg-white hover:bg-amber-100"
				@click="toolSlug = tool.slug"
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
				{{ tool.description }}
			</td>
		</tr>
	</table>

	<integrale />

	<quadratique />

	<affine />
</template>

<script setup>
	import FormInput from "@/Components/Form/FormInput"
	import { ref } from "vue"
	import Integrale from "@/Components/Tools/integrale"
	import Quadratique from "@/Components/Tools/quadratique"
	import Affine from "@/Components/Tools/affine"

	let toolSlug = ref(null)

	const props = defineProps({
		tools: {type: Object, default: ()=>{}},
	})

	// let toolComponents = []
	// for(let tool of props.tools){
	// 	console.log(tool.slug)
	// 	toolComponents[tool.slug] = defineAsyncComponent({
	// 		loader: ()=> import(/**/`@/Components/Tools/${tool.slug}`)
	// 	})
	// }
</script>

