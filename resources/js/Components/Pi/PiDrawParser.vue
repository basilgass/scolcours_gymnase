<template>
	<div :class="PiParserHasErrors?'bg-red-100':''">
		<!-- draw graph-->
		<div
			ref="draw"
			class="katex-m-0"
			@mouseup="drawMouseUp"
		/>

		<!-- stepper -->
		<div
			v-if="stepperMax>1"
			class="my-3"
		>
			<div v-if="stepperStart">
				<div class="flex items-center justify-center gap-10">
					<button
						class="px-3 py-2 btn btn-xs"
						:disabled="stepperIndex<=0"
						@click="stepperIndex--"
					>
						<i class="bi bi-chevron-left" />
					</button>
					<div>{{ stepperIndex + 1 }} / {{ stepperMax }}</div>
					<button
						class="px-3 py-2 btn btn-xs"
						:disabled="stepperIndex >= stepperMax-1"
						@click="stepperIndex++"
					>
						<i class="bi bi-chevron-right" />
					</button>
				</div>
				<div
					v-katex.auto="stepperText"
					class="my-3"
				/>
			</div>
			<div
				v-else
				class="w-full"
			>
				<button
					:class="`w-full btn-xs btn-scolcours-${$page.props.theme.slug} tracking-wider d-block`"
					@click="stepperStart=true"
				>
					Marche à suivre
				</button>
			</div>
		</div>
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
import {computed, inject, onMounted, ref, watch} from "vue"
import {PiDraw} from "pidraw/esm"

import VueSlider from "vue-slider-component"
import "vue-slider-component/theme/material.css"
import {PiMath} from "pimath/esm"
import katex from "katex"

const emits = defineEmits(["update"])

// Get the script value
let blockScriptResult = inject("blockScriptResult", ref({}))

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

let PiGraph, PiParser, PiAxis,
	PiParserHasErrors = ref(false)


let	stepperStart = ref(false),
	stepperMax = computed(()=>props.draw.code.split("\n\n").length),
	stepperIndex = ref(0),
	stepperText = computed(()=>{
		const step = drawCode.value.split("\n\n")[stepperIndex.value]
		if(step!==undefined){
			let steps = step.split("\n")
			if(steps[0].startsWith("%")){
				return steps[0].substring(1)
			}
		}
		return ""
	}),
	drawCode = computed(()=>{
		let outputCode = props.draw.code

		// Modify the code using the local information (sliders)
		if(sliders.value.length>0){
			// Remove the lines starting with $ (dollar sign)
			let code = outputCode.split("\n").filter(row=>row[0]!=="$")

			// Modify the value of all variables ($a, $b, ...)
			outputCode = code
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
		}

		// Modify the code according to the script level
		if(Object.values(blockScriptResult.value).length>0){
			for(let key in blockScriptResult.value){
				outputCode = outputCode.replaceAll(`$${key}`, blockScriptResult.value[key])
			}
		}

		if(stepperStart.value && stepperMax.value>1){
			return outputCode.split("\n\n").slice(0, stepperIndex.value+1).join("\n\n")
		}else{
			return outputCode
		}

	}),
	PiParserUpdate = function(from, withSliders = false) {
		if(withSliders) {
			getSliders()
		}

		try {
			PiParser.update(drawCode.value)
			emits("update", PiGraph.figures)
			PiParserHasErrors.value = false
		}catch{
			console.warn("Cannot parse from: " + from)
			console.warn(drawCode.value)
			PiParserHasErrors.value = true
		}
	}

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
			throwOnError: false,
			displayMode: true
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
		PiParserUpdate("onMounted", true)
	}
})

let drawMouseUp = function(){
	emits("update", PiGraph.figures)
}

// TODO: make PiDrawParser much better vue compatible (reactive) and using computed properties.
watch(drawCode, (code, before)=>{
	// Watch changes from "inside"
	PiParserUpdate("drawCode watcher")
})

watch(()=>props.draw, (newValue, oldValue)=>{
	if(newValue.code!==oldValue.code){
		PiParserUpdate("props.draw watcher", true)
	}else if(newValue.parameters !== oldValue.paramaeters){
		try {
			PiParser.updateLayout(newValue.parameters)
		}catch{
			console.log("Cannot parse (watch props.draw.parameters)", props.draw.params)
		}
	}
})

defineExpose({figures})
</script>
