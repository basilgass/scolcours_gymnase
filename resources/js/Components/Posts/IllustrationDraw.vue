<template>
	<div ref="root" />
</template>

<script setup>
import {onMounted, ref} from 'vue'

let root = ref(null)

// root.value.innerHTML = 'HELLO WORLD'

let props = defineProps({
	draw: {type: Object, default: ()=>{}}
})
//
onMounted(()=>{
	let graph = new PiDraw(root.value),
		axis = graph.axis(),
		parser = graph.parse('')

	if(props.draw.parameters){
		parser.updateLayout(props.draw.parameters)
	}
	if(props.draw.code){
		parser.update(props.draw.code)
	}

})
</script>
