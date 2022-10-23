<template>
	<div>
		<!-- draw graph-->
		<div
			ref="draw"
			@mouseup="drawMouseUp"
		/>

		<!-- slider(s) -->
		<div
			v-if="sliders.length>0 || texCode!==''"
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
import katex from "katex"

const emits = defineEmits(["update"])

// SVG drawing container
let draw = ref(null)

// Incoming props
let props = defineProps({
	width: {type: Number, default: 400},
	height: {type: Number, default: 320},
	draw: {
		type: Object, default: () => {
			return {
				code: "",
				parameters: ""
			}
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

			// $a=a,b,...,c/interval=default
			// interval not given => interval = b-a
			// b-a: marks separation... or maybe all given manually !
			// default value given at start.
			//TODO: add labels to pi-draw-parser

			if(rowItem!=="") {
				let marks = rowItem.match(/^([-0-9.,]+)/),
					a,b,c,marksInterval,
					interval = rowItem.match(/\/([0-9.]+)/),
					dft = rowItem.match(/=([-0-9.]+)$/)

				if(marks){
					marks = marks[1].split(",")
					if(marks.includes("...")){
						if(marks.length===3){
							// a,...,c
							a = +marks[0]
							marksInterval = 1
							c = +marks[2]

							if(c<=a){continue}

							marks = []
							for(let i=a; i<=c; i++){
								marks.push(i)
							}
						}else if(marks.length===4){
							a = +marks[0]
							b = +marks[1]
							marksInterval = b-a
							c = +marks[3]

							if(marksInterval<=0.01){continue}
							marks = []
							for(let i=a; i<=c; i+=marksInterval){
								marks.push(PiMath.Numeric.numberCorrection(i))
							}
						}
					}else{
						marks = marks.map(x=>+x)
					}
				}else{
					continue
				}

				if(interval){
					interval = +interval[1]
				}else{
					interval = PiMath.Numeric.numberCorrection(marks[1]-marks[0])
				}

				if(dft){
					dft = +dft[1]
				}else{
					dft = marks[0]
				}

				sliders.value.push({
					key: rowKey,
					value: dft,
					options: {
						min: marks[0],
						max: marks[marks.length-1],
						interval: interval,
						marks: marks,
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
		// Remove the lines starting with $ (dollar sign)
		let code = props.draw.code.split("\n").filter(row=>row[0]!=="$")

		// Modify the value of all variables ($a, $b, ...)
		return code
			.map(row=>{
				sliders.value.forEach(slider => {
					if(row.split("=")[0].includes("(x)")) {
						row = row.replaceAll(slider.key, `(${slider.value})`)
					}else{
						row = row.replaceAll(slider.key, slider.value)
					}
				})
				return row
			})
			.join("\n")
	}else{
		return props.draw.code
	}
})

let figures = ref({})

onMounted(() => {
	PiGraph = new PiDraw(draw.value, {
		width: props.width,
		height: props.height,
		origin: {
			x: 200,
			y: 160
		},
		grid: {
			x: 20,
			y: 20
		}
	})

	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false
		}
	}

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
			emits("update", PiGraph.figures)
		}catch{
			console.log("Cannot parse", drawCode.value)
		}
	}
})

let drawMouseUp = function(){
	emits("update", PiGraph.figures)
}
watch(drawCode, (code, before)=>{
	// Watch changes from "inside"
	try {
		PiParser.update(drawCode.value)
		emits("update", PiGraph.figures)
	}catch{
		console.log("Cannot parse (watch drawCode)", drawCode.value)
	}
})

watch(()=>props.draw.code, (code, before) => {
	// Watch changes from "outside"
	getSliders()
	try {
		PiParser.update(drawCode.value)
		emits("update", PiGraph.figures)
	}catch{
		console.log("Cannot parse (watch props.draw.code) ", drawCode.value)
	}
})

watch(() => props.draw.parameters, (params, before) => {
	try {
		PiParser.updateLayout(params)
	}catch{
		console.log("Cannot parse (watch props.draw.parameters)", props.draw.params)
	}
})

defineExpose({figures})
</script>
