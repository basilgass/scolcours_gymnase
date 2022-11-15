<template>
	<div class="keyboard-study">
		<div
			v-show="showGraph"
			class="overflow-x-scroll my-5"
		>
			<!-- Visual output -->
			<div ref="draw" />
			<div ref="outputHTML" />
		</div>

		<div class="keyboard-study-items">
			<div class="flex gap-1 lg:gap-2 items-baseline justify-center keyboard">
				<button
					v-for="item in items"
					:key="item"
					v-katex.ascii.nomargin="item"
					class="key bg-white hover:bg-amber-300 transition-colors"
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

		<div class="keyboard keyboard-study-keyboard flex flex-col gap-3">
			<!-- BValidation button -->
			<button
				ref="validateButton"
				class="key key-cmd bg-white w-full
				border-green-700 text-green-600 hover:bg-green-100 hover:border-green-800
				mb-3"
				@click="btnValidate"
			>
				<i class="bi bi-check" /> <span class="hidden md:inline md:ml-2">Valider</span>
			</button>

			<!-- Keyboard selection -->
			<div class="keyboard flex gap-3 justify-center">
				<button
					v-for="btn of addButtons"
					:key="btn"
					class="key bg-white flex-1"
					@click="addItemToGraph(btn)"
				>
					{{ btn }}
				</button>
			</div>

			<div>
				<button
					class="btn btn-primary"
					@click="plotGraph"
				>
					Tracer
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
				keyboard="algebra"
				key-class="bg-white"
				reset
				back
				@tex="tex = $event"
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
	options: {type: String}
})

let emits = defineEmits(["update:modelValue", "tex", "raw", "validate"])

let outputHTML = ref(null),
	validateButton = ref(null),
	btnValidate = function () {
		// Get all outputs
		emits("update:modelValue", items.value.sort().join(","))
		emits("tex", "")
		emits("raw", showRawOutput.value?PiGraph.svg.svg():"")
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
			emits("tex", resolve)
			emits("raw", showRawOutput.value?PiGraph.svg.svg():"")
		})

		return ""
	},
	getRaw = function () {
		nextTick(() => outputHTML.value.$el.innerHTML).then(resolve => {
			emits("raw", PiGraph.svg.svg())
		})
	}

defineExpose({resetKeyStrokes, wrongAnswer, getTex, getRaw})

// Code specific to Study.
let PiGraph,
	plot,
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
			}else if(opt==="p"){
				addButtons.value.push("point")
			}else if(opt==="o"){
				addButtons.value.push("ordonnée")
			}else if(opt==="z"){
				addButtons.value.push("zéro")
			}else if(opt==="t"){
				addButtons.value.push("trou")
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
	emits("raw", showRawOutput.value?PiGraph.svg.svg():"")
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
	}
	else{
		if(!(display.value.startsWith("(") && display.value.endsWith(")") && display.value.split(";").length===2)){
			message.value="Ce n'est pas un point"
			return
		}

		let [x, y] = display.value.replace("(", "").replace(")", "").split(";")

		if(btn==="zéro" && y!=="0"){
			message.value ="Ce n'est pas un zéro"
			return
		}
		if(btn==="ordonnée" && x!=="0"){
			message.value ="Ce n'est pas une ordonnée à l'origine"
			return
		}

		itemsGraph.value[display.value] = addPoint(btn, x, y)
	}

	// Add the element to the list of object created...
	items.value.push(display.value)

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()

	// Update the graph
	emits("raw", showRawOutput.value?PiGraph.svg.svg():"")
}

function removeItem(item) {
	items.value.splice(items.value.indexOf(item), 1)

	// Remove the control points.
	Object.values(itemsGraph.value[item].controls||[]).forEach(el=>el.remove())
	// Remove the bezier points.
	Object.values(itemsGraph.value[item].bezier||[]).forEach(group=>group.forEach(el=>el.remove()))
	// Remove the main object
	itemsGraph.value[item].element.remove()

	// Remove the key from the ist
	delete itemsGraph.value[item]

	// Update the graph
	emits("raw", showRawOutput.value?PiGraph.svg.svg():"")
}

function btnClickEvent(btn){
	btn.svg.on("click", (ev) => {
		if (btn.svg.fill() === "white") {
			btn.svg.fill("green")
		} else {
			btn.svg.fill("white")
		}
	})

	return btn
}

function addAV(value){
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posX = PiGraph.unitsToPixels({
			x: pos,
			y: 0
		}).x,
		y = PiGraph.unitYDomain,
		size = PiGraph.distanceToPixels(1)/3

	return {
		type: "av",
		element: PiGraph.path(`M${posX},${0} L${posX},${PiGraph.height}`).color("red"),
		controls: {
			"LT": btnClickEvent(PiGraph.point(pos-0.5, y.max-0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(pos+0.5, y.max-0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(pos-0.5, y.min+0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(pos+0.5, y.min+0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
		},
		bezier: {
			"LT": [PiGraph.point(pos-0.1, y.max), PiGraph.point(pos-0.05, y.max+5)],
			"RT": [PiGraph.point(pos+0.1, y.max), PiGraph.point(pos+0.05, y.max+5)],
			"LB": [PiGraph.point(pos-0.1, y.min), PiGraph.point(pos-0.05, y.min-5)],
			"RB": [PiGraph.point(pos+0.1, y.min), PiGraph.point(pos+0.05, y.min-5)],
		}
	}

}

function addAH(value){
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posY = PiGraph.unitsToPixels({
			x: 0,
			y: pos
		}).y,
		x = PiGraph.unitXDomain,
		size = PiGraph.distanceToPixels(1)/3

	return {
		type: "ah",
		element: PiGraph.path(`M${0},${posY} L${PiGraph.width},${posY}`).color("green"),
		controls: {
			"LT": btnClickEvent(PiGraph.point(x.min+0.5, pos+0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(x.min+0.5, pos-0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(x.max-0.5, pos+0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(x.max-0.5, pos-0.5).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
		},
		bezier: {
			"LT": [PiGraph.point(x.min, pos+0.1), PiGraph.point(x.min-5, pos+0.05)],
			"LB": [PiGraph.point(x.min, pos-0.1), PiGraph.point(x.min-5, pos-0.05)],
			"RT": [PiGraph.point(x.max, pos+0.1), PiGraph.point(x.max+5, pos+0.05)],
			"RB": [PiGraph.point(x.max, pos-0.1), PiGraph.point(x.max+5, pos-0.05)],
		}
	}
}

function addAO(value){
	let line = new PiMath.Geometry.Line(value),
		size = PiGraph.distanceToPixels(1)/3,
		A, B, x, y, Apixels, Bpixels

	x = PiGraph.unitXDomain.min
	y = line.getValueAtX(x).value
	if(y < PiGraph.unitYDomain.min || y > PiGraph.unitYDomain.max){
		y = PiGraph.unitYDomain.max
		x = line.getValueAtY(y).value
	}
	A = {x: +x,y: +y}
	Apixels = PiGraph.unitsToPixels({x, y})

	x = PiGraph.unitXDomain.max
	y = line.getValueAtX(x).value
	if(y < PiGraph.unitYDomain.min || y > PiGraph.unitYDomain.max){
		y = PiGraph.unitYDomain.min
		x = line.getValueAtY(y).value
	}
	B = {x: +x,y: +y}
	Bpixels = PiGraph.unitsToPixels({x, y})

	let dLine = line.director,
		dLineNorm = dLine.norm,
		pLine = line.normal,
		pLineNorm = pLine.norm,
		delta = 0.5,
		dxy = {
			x: dLine.x.value/dLineNorm,
			y: dLine.y.value/dLineNorm,
		},
		pxy = {
			x: pLine.x.value/pLineNorm*delta,
			y: pLine.y.value/pLineNorm*delta,
		}

	return {
		type: "ao",
		element: PiGraph.path(`M${Apixels.x},${Apixels.y} L${Bpixels.x},${Bpixels.y}`).color("green"),
		controls: {
			"LT": btnClickEvent(PiGraph.point(
				A.x + dxy.x + pxy.x,
				A.y + dxy.y + pxy.y
			).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(
				A.x + dxy.x - pxy.x,
				A.y + dxy.y - pxy.y
			).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(
				B.x - dxy.x + pxy.x,
				B.y - dxy.y + pxy.y
			).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(
				B.x - dxy.x - pxy.x,
				B.y - dxy.y - pxy.y
			).asSquare(size).fill({color: "white", opacity: 0.5}).hideLabel()),
		},
		bezier: {
			"LT": [
				PiGraph.point(A.x - dxy.x + pxy.x/10, A.y - dxy.y + pxy.y/10),
				PiGraph.point(A.x - dxy.x*5 + pxy.x/20, A.y - dxy.y*5 + pxy.y/20),
			],
			"LB": [
				PiGraph.point(A.x - dxy.x - pxy.x/10, A.y - dxy.y - pxy.y/10),
				PiGraph.point(A.x - dxy.x*5 - pxy.x/20, A.y - dxy.y*5 - pxy.y/20),
			],
			"RT": [
				PiGraph.point(B.x + dxy.x + pxy.x/10, A.y + dxy.y + pxy.y/10),
				PiGraph.point(B.x + dxy.x*5 + pxy.x/20, A.y + dxy.y*5 + pxy.y/20),
			],
			"RB": [
				PiGraph.point(B.x + dxy.x - pxy.x/10, A.y + dxy.y - pxy.y/10),
				PiGraph.point(B.x + dxy.x*5 - pxy.x/20, A.y + dxy.y*5 - pxy.y/20),
			],
		}
	}
}

function addPoint(type, x, y){
	let P = PiGraph.point(x, y),
		pixels = PiGraph.unitsToPixels({x, y}),
		bar = PiGraph.path(`M${pixels.x-50},${pixels.y} L${pixels.x+50},${pixels.y}`).hide()
	if(type==="trou"){
		P.asCircle().fill("white")
	}else if(type==="extremum"){
		P.asCircle().fill("black")
		bar.stroke("red").show()
	}else{
		P.asCircle().fill("black")
	}
	P.hideLabel()

	return {
		type: "point",
		beziercontrol: type==="extremum"?"flat":"smooth",
		element: P,
		controls: {
			bar
		}
	}
}

function plotGraph(){
	// Get all points
	let ctrlPoints = []
	for(let item of Object.values(itemsGraph.value)){
		if(item.type==="point") {
			ctrlPoints.push({
				point: item.element,
				control: item.beziercontrol,
				ratio: 0.5
			})
		}else{
			// Check the selected buttons
			for(let key in item.controls){
				if( item.controls[key].svg.fill()==="green" ){
					ctrlPoints = ctrlPoints.concat(...item.bezier[key].map(pt=>{return{
						point: pt,
						control: item.type,
						ratio: 0.5
					} }))
				}
			}
		}
	}

	// Sort the points.
	ctrlPoints.sort((a,b)=>a.point.x-b.point.x)

	if(plot!==undefined){}
	plot = PiGraph.bezier(ctrlPoints)
}
</script>
