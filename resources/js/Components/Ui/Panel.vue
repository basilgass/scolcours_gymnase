<!--
Mise en forme d'un "panel" tout simple.
Utilisé pour encadrer de manière uniforme des zones.
TODO: à améliorer, avec plus d'option (couleurs, côtés, ...)
-->
<script setup lang="ts">
import { computed } from "vue"

const props = defineProps({
	type: {type: String, default: null}
})

const panelClass = computed(()=>{
	if(props.type!==null && design[props.type]!==undefined){
		return design[props.type]
	}else{
		return design.default
	}
})

// let panelTitle = computed(()=>{
// 	if(props.title!==null){return props.title}
//
// 	if(props.type!==null && design[props.type]!==undefined){
// 		return design[props.type].label
// 	}else{
// 		return ""
// 	}
// })

const design = {
	"default": {
		panel: "bg-white border border-gray-200",
		title: "text-black"
	},
	"success": {
		panel: "bg-white border-2 border-green-600",
		title: "text-green-800"
	},
	"definition": {
		panel: "bg-white border-2 border-green-600",
		title: "text-green-800",
		label: "définition"
	},
	"theorem": {
		panel: "bg-white border-2 border-purple-600",
		title: "text-purple-800",
		label: "théorème"
	},
	"exercise": {
		panel: "bg-white border-2 border-pink-600",
		title: "text-pink-800",
		label: "exercice"
	}
}
</script>

<template>
	<article
		class="px-4 py-2 rounded-xl border transition-all"
		:class="panelClass.panel"
	>
		<h2
			v-if="$slots.title"
			class="font-normal mb-4 border-b"
			:class="`border-b border-scolcours-${$page.props.theme.slug}`"
		>
			<slot name="title" />
		</h2>

		<slot />
	</article>
</template>
