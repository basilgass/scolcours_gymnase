<template>
	<div class="max-w-xl mx-auto">
		<div
			v-show="showGraph"
			class="overflow-x-scroll my-5"
		>
			<!-- Visual output -->
			<div ref="draw" />
			<div ref="outputHTML" />
		</div>

		<div>
			<div class="flex gap-5 items-baseline justify-center">
				<button
					v-for="item in items"
					:key="item"
					v-katex.ascii.nomargin="item"
					class="btn py-2 bg-white hover:bg-amber-300 transition-colors"
					@dblclick="removeItem(item)"
				/>
			</div>
			<div
				v-show="items.length>0"
				class="text-xs text-gray-700 text-center"
			>
				double-cliquer pour supprimer
			</div>
		</div>

		<div class="flex flex-col gap-3 keyboard">
			<button
				ref="validateButton"
				class="key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800
				mb-3"
				@click="btnValidate"
			>
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</button>

			<!-- Keyboard selection -->
			<div class="flex gap-3 justify-center">
				<button
					v-for="btn of addButtons"
					:key="btn"
					class="py-0 px-10 btn bg-white py-3"
					@click="addItemToGraph(btn)"
				>
					{{ btn }}
				</button>
			</div>
			<!-- Keyboard inputs -->
			<div class="min-h-[4em]">
				<div v-katex="tex" />
				<div
					class="text-center text-red-500 text-sm"
					v-html="message"
				/>
			</div>

			<KeyboardBase
				ref="keyboardUI"
				v-model="display"
				v-model:tex="tex"
				keyboard="algebra"
				key-class="bg-white"
				class="max-w-xl mx-auto"
				reset
				back
				@clear="message=''"
			/>
		</div>
	</div>
</template>

<script setup>

import {nextTick, onMounted, ref} from "vue"
import {wrongAnswerAnimation} from "@/Composables/useHelpers"
import {PiDraw} from "pidraw/esm"
import katex from "katex"
import Button from "@/Components/Auth/Button.vue"
import {PiMath} from "pimath/esm"
import KeyboardBase from "@/Components/Keyboards/KeyboardBase.vue"

let props = defineProps({
	modelValue: {type: String, required: true},
	tex: {type: String, required: true},
	raw: {type: String, required: true},
	options: {type: String}
})

let emits = defineEmits(["update:modelValue", "update:tex", "update:raw", "validate"])

let outputHTML = ref(null),
	validateButton = ref(null),
	btnValidate = function () {
		// Get all outputs
		emits("update:modelValue", items.value.sort().join(","))
		emits("update:tex", "")
		emits("update:raw", showRawOutput.value?PiGraph.svg.svg():"")
		emits("validate")
	},
	resetKeyStrokes = function () {
		// Reset keystrokes
		for(let item in items.value){
			removeItem(item)
		}
	},
	wrongAnswer = function () {
		wrongAnswerAnimation(validateButton.value)
	},
	getTex = function (value) {
		const v = value.split("@")

		nextTick(() => outputHTML.value.$el.innerHTML).then(resolve => {
			emits("update:tex", resolve)
			emits("update:raw", showRawOutput.value?PiGraph.svg.svg():"")
		})

		return ""
	},
	getRaw = function () {
		nextTick(() => outputHTML.value.$el.innerHTML).then(resolve => {
			emits("update:raw", PiGraph.svg.svg())
		})
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

// Code specific to Study.
let PiGraph,
	draw = ref(null),
	keyboardUI = ref(null),
	theOptions = ref(props.options.toLowerCase().split(",")),
	addButtons = ref([]),
	tex = ref(""),
	display = ref(""),
	message = ref(""),
	showGraph = ref(true),
	showRawOutput = ref(false),
	items = ref([]),
	itemsGraph = ref({})

onMounted(()=>{
	let fx = null,
		cfg = cfg = {
			xMin: -10,
			xMax: 10,
			yMin: -10,
			yMax: 10,
			pixelsPerUnit: 40
		},
		cfgRaw = null

	if(theOptions.value.length>0){
		for(let opt of theOptions.value){
			if(opt==="ah"){
				addButtons.value.push("AH")
			}else if(opt==="av"){
				addButtons.value.push("AV")
			}else if(opt==="ao"){
				addButtons.value.push("AO")
			}else if(opt==="p" || opt==="z" || opt==="o"){
				if(addButtons.value.indexOf("point")===-1) {
					addButtons.value.push("point")
				}
			}else if(opt==="e"){
				addButtons.value.push("extremum")
			}else if(opt==="hide"){
				showGraph.value=false
			}else if(opt==="raw"){
				showRawOutput.value=true
			}else if(opt.startsWith("f=")){
				fx = opt.split("f=")[1]
			}else if(opt.startsWith("cfg=")){
				cfgRaw = opt.split("=")[1]
			}
		}
	}else{
		addButtons.value = ["AV", "AH", "AO", "extremum", "point"]
	}

	if(cfgRaw!==null){
		let d = cfgRaw.split("&")
		if(d.length === 2){
			cfg.xMin = +d[0].split(":")[0]
			cfg.xMax = +d[0].split(":")[1]
			cfg.yMin = +d[1].split(":")[0]
			cfg.yMax = +d[1].split(":")[1]
			cfg.pixelsPerUnit = 800 / (cfg.xMax-cfg.xMin)
		}
	}

	PiGraph = new PiDraw(draw.value)
	PiGraph.updateLayout(cfg, false)

	PiGraph.axis()

	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false
		}
	}

	if(fx!==null){
		let plotData = fx.split("&"),
			plot = plotData.shift(),
			domain = PiGraph.unitXDomain,
			samples = 20,
			color = "blue"

		for(let d of plotData){
			if(!isNaN(d)){
				samples = +d
			}else if(d.includes(":")){
				const [min, max] = plotData[1].split(":").map(x => +x)
				domain = {min, max}
			}else{
				color = d
			}
		}

		try {
			const p = PiGraph.plot(plot, {
				samples,
				domain
			})
			p.stroke(color)

			// TODO: remove once PiDraw has been updated witt PlotConfig.animate option
			p.svg.attr({
				"stroke-dasharray": "",
				"stroke-dashoffset": ""
			})
		}catch {
			console.log("Error parsing", fx)
		}
	}

	// Update the value
	emits("update:raw", showRawOutput.value?PiGraph.svg.svg():"")
})

function addItemToGraph(btn){

	// Checker.
	message.value = ""
	if(btn.startsWith("A")){
		let equ = display.value.split("=")

		if(equ.length!==2){
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if(equ[0]!=="x" && equ[0]!=="y"){
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if(btn==="AO"){
			if(equ[1].match(/x/).length!==1 && equ[1].match(/y/).length!==1){
				message.value="Ce n'est pas une asymptote oblique"
				return
			}
			itemsGraph.value[display.value] = addAO(display.value)

		}else if(btn==="AV"){
			if(equ[0]!=="x"){
				message.value="Ce n'est pas une asymptote verticale"
				return
			}
			itemsGraph.value[display.value] = addAV(equ[1])

		}else if(btn==="AH") {
			if (equ[0]!=="y") {
				message.value = "Ce n'est pas une asymptote horizontale"
				return
			}
			itemsGraph.value[display.value] = addAH(equ[1])

		}
	}else if(btn==="point"){
		if(!(display.value.startsWith("(") && display.value.endsWith(")") && display.value.split(";").length===2)){
			message.value="Ce n'est pas un point"
			return
		}
	}else{
		console.log("Btn not handled")
		return
	}

	// Add the element to the list of object created...
	items.value.push(display.value)

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()

	// Update the graph
	emits("update:raw", showRawOutput.value?PiGraph.svg.svg():"")
}

function removeItem(item) {
	items.value.splice(items.value.indexOf(item), 1)

	itemsGraph.value[item].remove()
	delete itemsGraph.value[item]

	// Update the graph
	emits("update:raw", showRawOutput.value?PiGraph.svg.svg():"")
}

function addAV(value){
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posX = PiGraph.unitsToPixels({
			x: pos,
			y: 0
		}).x

	return PiGraph.path(`M${posX},${0} L${posX},${PiGraph.height}`).color("red")
}

function addAH(value){
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posY = PiGraph.unitsToPixels({
			x: 0,
			y: pos
		}).y

	return PiGraph.path(`M${0},${posY} L${PiGraph.width},${posY}`).color("green")
}

function addAO(value){
	let line = new PiMath.Geometry.Line(value),
		A = PiGraph.unitsToPixels({
			x: PiGraph.unitXDomain.min,
			y: line.getValueAtX(PiGraph.unitXDomain.min).value
		}),
		B = PiGraph.unitsToPixels({
			x: PiGraph.unitXDomain.max,
			y: line.getValueAtX(PiGraph.unitXDomain.max).value
		})

	return PiGraph.path(`M${A.x},${A.y} L${B.x},${B.y}`).color("green")
}
</script>
