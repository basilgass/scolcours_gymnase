<template>
	<div ref="draw" />
</template>

<script setup>
import {onMounted, ref, watch} from "vue"
import {PiDraw} from "pidraw/esm"

let draw = ref(null)

let props = defineProps({
	width: {type: Number, default: 400},
	height: {type: Number, default: 300},
	draw: {
		type: Object, default: () => {
		}
	},
	axis: {type: Boolean, default: false}
})

let PiGraph, PiParser, PiAxis

onMounted(() => {

	PiGraph = new PiDraw(draw.value, {
		width: props.width,
		height: props.height,
		origin: {
			x: 200,
			y: 150
		},
		grid: {
			x: 20,
			y: 20
		}
	})

	if(props.axis){
		PiAxis = PiGraph.axis()
	}

	PiParser = PiGraph.parse("")

	if (props.draw.parameters) {
		PiParser.updateLayout(props.draw.parameters)
	}

	if (props.draw.code) {
		try {
			PiParser.update(props.draw.code)
		}catch{
			console.log("Cannot parse", props.draw.code)
		}
	}
})

watch(() => props.draw.code, (code, before) => {
	try {
		PiParser.update(code)
	}catch{
		console.log("Cannot parse", props.draw.code)
	}
})
</script>
