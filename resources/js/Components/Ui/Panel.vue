<template>
	<article
			:class="panelClass.panel"
			class="bg-white px-4 py-2 rounded-xl border border-gray-300 transition-all"
		>
		<div
				v-if="panelTitle"
				class="uppercase -mt-1 mb-1"
				:class="panelClass.title"
			>
			{{ panelTitle }}
		</div>
		<slot />
	</article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	type: {type: String, default: null},
	title: { type: String, default: null },
})

let panelClass = computed(()=>{
	if(props.type!==null && design[props.type]!==undefined){
		return design[props.type]
	}else{
		return design.default
	}
})

let panelTitle = computed(()=>{
	if(props.title!==null){return props.title}
	
	if(props.type!==null && design[props.type]!==undefined){
		return design[props.type].label
	}else{
		return ''
	}
})

const design = {
	'default': {
		panel: 'bg-white border border-gray-200',
		title: 'text-black'
	},
	'success': {
		panel: 'bg-white border-2 border-green-600',
		title: 'text-green-800'
	},
	'definition': {
		panel: 'bg-white border-2 border-green-600',
		title: 'text-green-800',
		label: 'définition'
	},
	'theorem': {
		panel: 'bg-white border-2 border-purple-600',
		title: 'text-purple-800',
		label: 'théorème'
	}
}
</script>
