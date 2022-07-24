<template>
	<div>
		<div ref="draw" />
		<div
			v-if="sliders.length>0"
			class="space-y-12 mt-6"
		>
			<vue-slider
				v-for="(slider, index) of sliders"
				:key="`slider-${index}`"
				v-model="slider.value"
				v-bind="slider.options"
				@change="slider.value"
			/>
			<div v-katex="texOutput" />
		</div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue"
import {PiDraw} from "pidraw/esm"

import VueSlider from "vue-slider-component"
import "vue-slider-component/theme/material.css"
import {PiMath} from "pimath/esm"

// SVG drawing container
let draw = ref(null)

// Incoming props
let props = defineProps({
	width: {type: Number, default: 400},
	height: {type: Number, default: 300},
	draw: {
		type: Object, default: () => {
		}
	},
	axis: {type: Boolean, default: true}
})

// Sliders reactivity and methods
let sliders = ref([]),
	texCode = ref("")

let texOutput = computed(()=>{
	let tex = texCode.value
	sliders.value.forEach(slider => {
		tex = tex.replaceAll(slider.key, slider.value)
	})

	return tex.replaceAll("+-", "-")
		.replaceAll("--", "+")
})
let getSliders = function(){
	// All slider are like: $a=...
	sliders.value = []
	for(let row of props.draw.code.split("\n")){
		if(row[0]==="$"){
			const rowData = row.split("="),
				rowKey = rowData.shift(),
				rowItem = rowData.join("=")

			// Output
			if(rowKey==="$tex"){
				texCode.value = rowItem
				continue
			}


			if(rowItem!=="") {
				let valuesData = rowItem.split("/"),
					values = valuesData[0].split(","),
					divider = 1

				if(valuesData.length===2)divider = +valuesData[1]

				let offset = 1,
					start = +values[0],
					end = +values[values.length-1]

				if(values.length===4){
					offset = +values[1]-values[0]
				}

				if(offset<0.1){offset = 1}
				let marksValues = [+start]
				for(let i = start; i<end; i=i+offset){
					marksValues.push(PiMath.Numeric.numberCorrection(i))
				}
				marksValues.push(end)

				sliders.value.push({
					key: rowKey,
					value: start,
					options: {
						min: start,
						max: end,
						interval: offset/divider,
						marks: marksValues,
						tooltip: "none"
					}
				})
			}
		}
	}
}

let PiGraph, PiParser, PiAxis

let	drawCode = computed(()=>{
	if(sliders.value.length>0){
		let code = props.draw.code.split("\n").filter(row=>row[0]!=="$")

		return code
			.map(row=>{
				sliders.value.forEach(slider => {
					row = row.replaceAll(slider.key, `(${slider.value})`)
				})
				return row
			})
			.join("\n")
	}else{
		return props.draw.code
	}
})

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

	if (drawCode.value) {
		getSliders()
		try {
			PiParser.update(drawCode.value)
		}catch{
			console.log("Cannot parse", drawCode.value)
		}
	}
})

watch(drawCode, (code, before)=>{
	PiParser.update(drawCode.value)
})
watch(()=>props.draw.code, (code, before) => {
	getSliders()
	try {
		PiParser.update(drawCode.value)
	}catch{
		console.log("Cannot parse (watch props.draw.code) ", drawCode.value)
	}
})

watch(() => props.draw.parameters, (params, before) => {
	try {
		PiParser.updateLayout(params)
	}catch{
		console.log("Cannot parse", props.draw.params)
	}
})
</script>
