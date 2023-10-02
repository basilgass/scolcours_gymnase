<template>
	<article class="keyboard-study grid grid-cols-1 @xl:grid-cols-2 gap-3">
		<div>
			<!-- Visual output - qui est remonte en tant que "raw"-->
			<div
					ref="draw"
					class="min-w-[1em]"
			/>

			<!-- Trace button -->
			<div
					v-if="enablePlot"
					class="text-center"
			>
				<button
						class="btn btn-primary btn-xs px-10"
						@click="plotGraph"
				>
					tracer le graphe
				</button>
			</div>
		</div>

		<!-- keyboard -->
		<div class="keyboard keyboard-study-keyboard flex flex-col gap-3">
			<!-- currently loaded elements (point, max, min, av, ...) -->
			<div class="keyboard-study-items my-3">
				<div class="flex gap-1 lg:gap-2 items-baseline justify-center keyboard min-h-[3em]">
					<button
							v-for="item in items"
							:key="item"
							v-katex.ascii.nomargin="displayItem(item)"
							class="key-touch bg-white hover:bg-amber-300 transition-colors"
							@dblclick="removeItem(item)"
					/>

					<!-- Keyboard inputs -->
					<div v-katex="display.tex"/>
				</div>
				<div
						class="text-center text-red-500 text-sm"
						v-html="message"
				/>
				<div
						v-show="items.length>0"
						class="text-xs text-gray-700 text-center"
				>
					double-cliquer pour supprimer ou
					<button
							class="btn btn-xs bg-white"
							@click="removeAllItems()"
					>
						<i class="bi bi-trash mr-3 text-red-800"/>tout supprimer
					</button>
				</div>
			</div>

			<!-- Keyboard selection -->
			<div class="keyboard flex flex-wrap gap-3 justify-center">
				<button
						v-for="key of addButtons"
						:key="key"
						:title="btnKeys[key].description"
						class="key bg-white flex-1"
						@click="addItemToGraph(key)"
				>
					{{ btnKeys[key].label }}
				</button>
			</div>

			<KeyboardDisplay
					ref="keyboardUI"
					back
					key-class="bg-white"
					keyboard="algebra"
					reset
					@change="display = $event"
					@clear="message=''"
			/>
		</div>
	</article>
</template>

<script setup>
// TODO: permettre l'affichage de la réponse.
// TODO: retravailler pour être plus facile à modifier / debogguer
import {onMounted, ref} from "vue"
import {PiDraw} from "pidraw/esm"
import katex from "katex"
import Button from "@/Components/Auth/Button.vue"
import {PiMath} from "pimath/esm"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {customCheck} from "@/Composables/checkersConfig"
import {useKeyboard} from "@/Composables/useKeyboard";

let props = defineProps({
	keyboard: {type: Object, required: true},
	answer: {type: String}
})

let emits = defineEmits(["change", "validate"]),
	changeEvent = function (event) {
		// On récupère la mise en forme de la réponse
		const output = validateOutput()
		// On valide la réponse
		const validation = customCheck('study', props.answer, output)

		emits("change", {
			value: {
				input: output,
				tex: "",
				raw: showRawOutput.value ? PiGraph.svg.svg() : ""
			},
			validation
		})
	}


// Mise en forme de la réponse pour comparaison
let validateOutput = function () {
	let output = ""

	if (enablePlot.value) {
		let arr = []
		for (let item of items.value) {
			arr.push(asymptoteToAnswer(item))
		}
		let envCtrls = asymptoteToAnswer("env")
		if (envCtrls !== "env") {
			arr.push(envCtrls)
		}
		output = arr.sort().join(",")
	} else {
		output = [...items.value].sort().join(",")
	}

	return output
}


// Code specific to Study.
//TODO: KeyboardStudy : more rubstness for theOptions (parameters vs values), which are actually concatenated.
let PiGraph,
	plot,
	plotResult = ref(null),
	draw = ref(null),
	keyboardUI = ref(null),
	theOptions = ref(props.keyboard.parameters.concat(props.keyboard.values)),
	addButtons = ref([]),
	tex = ref(""),
	display = ref({input: "", tex: "", raw: ""}),
	message = ref(""),
	showGraph = ref(false),
	enablePlot = ref(false),
	showRawOutput = ref(false),
	items = ref([]),
	itemsGraph = ref({})

const btnKeys = {
	"ah": {
		label: "AH", description: "asymptote verticale"
	},
	"av": {
		label: "AV", description: "asymptote horizontale"
	},
	"ao": {
		label: "AO", description: "asymptote oblique"
	},
	"!": {
		label: "rien", description: "aucune asymptote"
	},
	"p": {
		label: "point", description: "point quelconque"
	},
	"z": {
		label: "zéro", description: "zéro"
	},
	"o": {
		label: "ordonnée", description: "ordonnée à l'origine"
	},
	"t": {
		label: "trou", description: "trou"
	},
	"m": {
		label: "min", description: "minimum"
	},
	"mm": {
		label: "max", description: "maximum"
	},
	"_": {
		label: "replat", description: "replat"
	}
}

onMounted(() => {
	let fx = null,
		cfg = {
			xMin: -10,
			xMax: 10,
			yMin: -10,
			yMax: 10,
			xUnit: 1,
			yUnit: 1,
			pixelsPerUnit: 40
		},
		cfgRaw = null

	let withButtons = []

	if (theOptions.value.length > 0) {
		for (let opt of theOptions.value) {
			if (opt.includes(",")) {
				const btns = opt.split(",")
				for (let btn of btns) {
					if (btnKeys[btn] !== undefined) {
						withButtons.push(btn)
					}
				}

			} else if (opt === "g") {
				showGraph.value = true
			} else if (opt === "trace") {
				showGraph.value = true
				enablePlot.value = true
			} else if (opt === "raw") {
				showRawOutput.value = true
			} else if (opt.startsWith("f=")) {
				fx = opt.split("f=")[1]
			} else if (opt.startsWith("p=")) {
				plotResult.value = opt.split("p=")[1]
			} else if (opt.startsWith("cfg=")) {
				cfgRaw = opt.split("=")[1]
			}
		}
	}

	if (withButtons.length === 0) {
		addButtons.value = ["av", "ah", "ao", "!", "p", "z", "o", "t", "m", "mm", "_"]
	} else {
		addButtons.value = [...withButtons]
	}

	if (cfgRaw !== null) {
		let d = cfgRaw.split("&")
		if (d.length >= 2) {
			cfg.xMin = +d[0].split(":")[0]
			cfg.xMax = +d[0].split(":")[1]
			cfg.yMin = +d[1].split(":")[0]
			cfg.yMax = +d[1].split(":")[1]
			cfg.xUnit = d[2] ? +d[2].split(":")[0] : 1
			cfg.yUnit = d[2] ? +d[2].split(':')[1] : 1
			// let res = d[3] ? +d[3] : 800
			// cfg.pixelsPerUnit = res / (cfg.xMax - cfg.xMin)
		}
	}

	console.log(cfg)

	PiGraph = new PiDraw(draw.value)


	PiGraph.updateLayout(cfg, false)
	PiGraph.pixelsPerUnit = {
		x: PiGraph.pixelsPerUnit.x / cfg.xUnit,
		y: PiGraph.pixelsPerUnit.y / cfg.yUnit
	}
	PiGraph.axis()
	PiGraph.texConverter = {
		toTex: katex.renderToString,
		options: {
			throwOnError: false
		}
	}
	if (fx !== null) {
		let fxs = fx.split("|")
		for (let f of fxs) {
			initPlot(f)
		}
	}

	if (enablePlot.value) {
		itemsGraph.value["env"] = addTracePoints()
	}


	// Add resize observer
	const resizeObserver = new ResizeObserver((entries) => {
		PiGraph.update()
	})
	resizeObserver.observe(draw.value)

	// Update the value
	// nextTick().then(()=>changeEvent())
})

function initPlot(fx) {
	let plotData = fx.split("&"),
		plot = plotData.shift(),
		domain = PiGraph.unitXDomain,
		samples = 20,
		color = "blue"

	for (let d of plotData) {
		if (!isNaN(d)) {
			samples = +d
		} else if (d.includes(":")) {
			const [min, max] = d.split(":").map(x => +x)
			domain = {min, max}
		} else {
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
	} catch {
		console.warn("Error parsing", fx)
	}
}

function addItemToGraph(btn) {

	// Checker.
	message.value = ""
	if (btn.startsWith("a")) {
		let value = display.value.input
		let equ = value.split("=")

		if (equ.length !== 2) {
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if (equ[0] !== "x" && equ[0] !== "y") {
			message.value = "L'équation de la droite n'est pas correcte"
			return
		}

		if (btn === "ao") {
			if (!value.match(/x/) || !value.match(/y/)) {
				message.value = "Ce n'est pas une asymptote oblique"
				return
			}
			itemsGraph.value[display.value.input] = addAO(display.value.input)

		} else if (btn === "av") {
			if (equ[0] !== "x") {
				message.value = "Ce n'est pas une asymptote verticale"
				return
			}
			itemsGraph.value[display.value.input] = addAV(equ[1])

		} else if (btn === "ah") {
			if (equ[0] !== "y") {
				message.value = "Ce n'est pas une asymptote horizontale"
				return
			}
			itemsGraph.value[display.value.input] = addAH(equ[1])
		}
	} else if (btn === "!") {
		display.value.input = "!!"
		itemsGraph.value["!!"] = null
	} else {
		if (!(display.value.input.startsWith("(") && display.value.input.endsWith(")") && display.value.input.split(";").length === 2)) {
			message.value = "Ce n'est pas un point"
			return
		}

		let [x, y] = display.value.input
			.substring(1, display.value.input.length - 2)
			.split(";")

		if (btn === "z" && y !== "0") {
			message.value = "Ce n'est pas un zéro"
			return
		}
		if (btn === "o" && x !== "0") {
			message.value = "Ce n'est pas une ordonnée à l'origine"
			return
		}

		itemsGraph.value[display.value.input] = addPoint(btn, x, y)
	}

	// Hide controls if necessary
	if (!enablePlot.value) {
		removeControlsAndBezier(display.value.input)
	}

	// Add the element to the list of object created...
	items.value.push(display.value.input)

	// Reset the keyboard
	keyboardUI.value.resetKeyStrokes()

	// Update the graph
	changeEvent()
}

function displayItem(value) {
	let item = itemsGraph.value[value]

	if (item === undefined) {
		return "?"
	}

	if (item.type !== "point") {
		return value
	}

	if (item.kind === "m") {
		return `\\text{min}${value}`
	} else if (item.kind === "mm") {
		return `\\text{max}${value}`
	} else if (item.kind === "_") {
		return `\\text{replat}${value}`
	} else if (item.kind === "t") {
		return `\\text{trou}${value}`
	}

	return value
}

function removeAllItems() {
	let keys = [...items.value]
	for (let item of keys) {
		removeItem(item)
	}

	if (showGraph.value) {
		if (plot) {
			plot.remove()
			plot = null
		}

		if (enablePlot.value) {
			removeControlsAndBezier("env")
			itemsGraph.value["env"] = addTracePoints()
		}
	}
}

function removeItem(item) {
	items.value.splice(items.value.indexOf(item), 1)

	removeControlsAndBezier(item)
	// Remove the main object
	if (itemsGraph.value[item].element !== null) {
		itemsGraph.value[item].element.remove()
	}

	// Remove the key from the ist
	delete itemsGraph.value[item]

	// Update the graph
	changeEvent()
}

function removeControlsAndBezier(item) {
	// Remove the control maxPoints.
	Object.values(itemsGraph.value[item].controls || []).forEach(el => {
		if (el) {
			el.remove()
		}
	})
	// Remove the bezier maxPoints.
	Object.values(itemsGraph.value[item].bezier || []).forEach(group => group.forEach(el => el.remove()))

}

function btnClickEvent(btn) {
	btn.svg.on("click", (ev) => {
		if (btn.svg.fill() === "white") {
			btn.svg.fill("green")
		} else {
			btn.svg.fill("white")
		}

		changeEvent()
	})
	return btn
}

function asymptoteToAnswer(item) {
	// il n'y a rien à montrer...
	if (itemsGraph.value[item] === undefined) {
		return ""
	}

	let ctrls = []
	if (itemsGraph.value[item].type === "point") {
		switch (itemsGraph.value[item].kind) {
			case "m":
				return `m${item}`
			case "mm":
				return `M${item}`
			case "_":
				return `_${item}`
			case "t":
				return `t${item}`
			default:
				return item
		}
	}


	for (let key in itemsGraph.value[item].controls) {
		if (itemsGraph.value[item].controls[key].svg.fill() === "green") {
			ctrls.push(key)
		}
	}

	return ctrls.length > 0 ? `${item}&${ctrls.sort().join("&")}` : item
}

function addAV(value, ctrls) {
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posX = PiGraph.unitsToPixels({
			x: pos,
			y: 0
		}).x,
		y = PiGraph.unitYDomain,
		size = PiGraph.distanceToPixels(1) / 3

	return {
		type: "av",
		element: PiGraph.path(`M${posX},${0} L${posX},${PiGraph.height}`).color("red"),
		controls: {
			"LT": btnClickEvent(PiGraph.point(pos - 0.5, y.max - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(pos + 0.5, y.max - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(pos - 0.5, y.min + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(pos + 0.5, y.min + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
		},
		bezier: {
			"LT": [PiGraph.point(pos - 0.1, y.max).hide(), PiGraph.point(pos - 0.05, y.max + 5).hide()],
			"RT": [PiGraph.point(pos + 0.1, y.max).hide(), PiGraph.point(pos + 0.05, y.max + 5).hide()],
			"LB": [PiGraph.point(pos - 0.1, y.min).hide(), PiGraph.point(pos - 0.05, y.min - 5).hide()],
			"RB": [PiGraph.point(pos + 0.1, y.min).hide(), PiGraph.point(pos + 0.05, y.min - 5).hide()],
		}
	}

}

function addAH(value) {
	let pos = (new PiMath.NumExp(value)).evaluate({}),
		posY = PiGraph.unitsToPixels({
			x: 0,
			y: pos
		}).y,
		x = PiGraph.unitXDomain,
		size = PiGraph.distanceToPixels(1) / 3

	const b1ratio = 5, b2ratio = 10
	return {
		type: "ah",
		element: PiGraph.path(`M${0},${posY} L${PiGraph.width},${posY}`).color("green"),
		controls: {
			"LT": btnClickEvent(PiGraph.point(x.min + 0.5, pos + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(x.min + 0.5, pos - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(x.max - 0.5, pos + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(x.max - 0.5, pos - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
		},
		bezier: {
			"LT": [PiGraph.point(x.min, pos + 0.1).hide(), PiGraph.point(x.min - 5, pos + 0.05).hide()],
			"LB": [PiGraph.point(x.min, pos - 0.1).hide(), PiGraph.point(x.min - 5, pos - 0.05).hide()],
			"RT": [PiGraph.point(x.max, pos + 0.1).hide(), PiGraph.point(x.max + 5, pos + 0.05).hide()],
			"RB": [PiGraph.point(x.max, pos - 0.1).hide(), PiGraph.point(x.max + 5, pos - 0.05).hide()],
		}
	}
}

function addAO(value) {
	let line = new PiMath.Geometry.Line(value),
		size = PiGraph.distanceToPixels(1) / 3,
		A, B, x, y, Apixels, Bpixels

	x = PiGraph.unitXDomain.min
	y = line.getValueAtX(x).value
	if (y < PiGraph.unitYDomain.min || y > PiGraph.unitYDomain.max) {
		y = y < PiGraph.unitYDomain.min ? PiGraph.unitYDomain.min : PiGraph.unitYDomain.max
		x = line.getValueAtY(y).value
	}
	let pt1 = {x: +x, y: +y}

	x = PiGraph.unitXDomain.max
	y = line.getValueAtX(x).value
	if (y < PiGraph.unitYDomain.min || y > PiGraph.unitYDomain.max) {
		y = y < PiGraph.unitYDomain.min ? PiGraph.unitYDomain.min : PiGraph.unitYDomain.max
		x = line.getValueAtY(y).value
	}
	let pt2 = {x: +x, y: +y}

	if (pt1.x < pt2.x) {
		A = {x: +pt1.x, y: +pt1.y}
		B = {x: +pt2.x, y: +pt2.y}
	} else {
		A = {x: +pt2.x, y: +pt2.y}
		B = {x: +pt1.x, y: +pt1.y}
	}

	Apixels = PiGraph.unitsToPixels(A)
	Bpixels = PiGraph.unitsToPixels(B)

	let dLine = line.director,
		dLineNorm = dLine.norm,
		pLine = line.normal,
		pLineNorm = pLine.norm,
		delta = 0.5,
		dxy = {
			x: dLine.x.value / dLineNorm,
			y: dLine.y.value / dLineNorm,
		},
		pxy = {
			x: pLine.x.value / pLineNorm * delta,
			y: pLine.y.value / pLineNorm * delta,
		}

	const b1ratio = 5, b2ratio = 10
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
				PiGraph.point(A.x - dxy.x + pxy.x / b1ratio, A.y - dxy.y + pxy.y / b1ratio),
				PiGraph.point(A.x - dxy.x * 5 + pxy.x / b2ratio, A.y - dxy.y * 5 + pxy.y / b2ratio),
			],
			"LB": [
				PiGraph.point(A.x - dxy.x - pxy.x / b1ratio, A.y - dxy.y - pxy.y / b1ratio),
				PiGraph.point(A.x - dxy.x * 5 - pxy.x / b2ratio, A.y - dxy.y * 5 - pxy.y / b2ratio),
			],
			"RT": [
				PiGraph.point(B.x + dxy.x + pxy.x / b1ratio, B.y + dxy.y + pxy.y / b1ratio),
				PiGraph.point(B.x + dxy.x * 5 + pxy.x / b2ratio, B.y + dxy.y * 5 + pxy.y / b2ratio),
			],
			"RB": [
				PiGraph.point(B.x + dxy.x - pxy.x / b1ratio, B.y + dxy.y - pxy.y / b1ratio),
				PiGraph.point(B.x + dxy.x * 5 - pxy.x / b2ratio, B.y + dxy.y * 5 - pxy.y / b2ratio),
			],
		}
	}
}

function addTracePoints() {
	const dx = PiGraph.unitXDomain,
		dy = PiGraph.unitYDomain,
		size = PiGraph.distanceToPixels(1) / 3

	return {
		type: "trace",
		element: null,
		controls: {
			"LT": btnClickEvent(PiGraph.point(dx.min + 0.5, dy.max - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"LB": btnClickEvent(PiGraph.point(dx.min + 0.5, dy.min + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RT": btnClickEvent(PiGraph.point(dx.max - 0.5, dy.max - 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
			"RB": btnClickEvent(PiGraph.point(dx.max - 0.5, dy.min + 0.5).asSquare(size).fill({
				color: "white",
				opacity: 0.5
			}).hideLabel()),
		},
		bezier: {
			"LT": [PiGraph.point(dx.min, dy.max).hide()],
			"LB": [PiGraph.point(dx.min, dy.min).hide()],
			"RT": [PiGraph.point(dx.max, dy.max).hide()],
			"RB": [PiGraph.point(dx.max, dy.min).hide()],
		}
	}
}

function getCoordinates(value) {
	if (!value.includes('(') || !value.includes(')')) {
		return [undefined, undefined];
	}

	// Remove the first parenthesis and the last one.
	let parts = value.split('('),
		key = parts.shift(),
		coords = parts.join('(')
	coords = coords.substring(0, coords.length - 1)

	return coords.split(";")
	// return value.match(/\(([^)]+)\)/)[1].split(';');
}

function addPoint(type, xValue, yValue) {

	let x = xValue === "" ? 0 : +(new PiMath.NumExp(xValue)).evaluate(),
		y = yValue === "" ? 0 : +(new PiMath.NumExp(yValue)).evaluate()

	// let x = new PiMath.Fraction(xValue).value,
	// 	y = new PiMath.Fraction(yValue).value
	let P = PiGraph.point(x, y),
		pixels = PiGraph.unitsToPixels({x, y}),
		bar, text, beziercontrol = "smooth"

	if (type === "trou" || type === "t") {
		P.asCircle().fill("white")
	} else if (type === "extremum" || type === "e" || type === "m" || type === "mm" || type === "_") {
		P.asCircle().fill("red")
		bar = PiGraph.path(`M${pixels.x - 50},${pixels.y} L${pixels.x + 50},${pixels.y}`)
		bar.stroke("red")

		if (type === "m") {
			text = PiGraph.svg.text("MIN").move(pixels.x - 5, pixels.y + 10)
		} else if (type === "mm") {
			text = PiGraph.svg.text("MAX").move(pixels.x - 5, pixels.y - 20)
		}

		beziercontrol = "flat"
	} else {
		P.asCircle().fill("black")
	}
	P.hideLabel()

	return {
		type: "point",
		kind: type,
		beziercontrol,
		element: P,
		controls: {
			bar,
			text
		}
	}
}

function plotGraph() {
	// Remove existing plot.
	if (plot) {
		plot.remove()
	}
	// Check the validation -
	// if the result is TRUE, trace the existing value (if it exists).
	const check = customCheck("study", props.answer, validateOutput())
	if (check.result && plotResult.value) {
		initPlot(plotResult.value)
		return
	}

	// Get all maxPoints
	let ctrlPoints = []

	for (let item of Object.values(itemsGraph.value)) {
		if (item.type === "point") {
			ctrlPoints.push({
				point: item.element,
				control: item.beziercontrol,
				ratio: 0.5
			})
		} else {
			// Check the selected buttons
			for (let key in item.controls) {
				if (item.controls[key].svg.fill() === "green") {
					ctrlPoints = ctrlPoints.concat(...item.bezier[key].map(pt => {
						return {
							point: pt,
							control: item.type,
							ratio: 0.5
						}
					}))
				}
			}
		}
	}

	// Sort the maxPoints.
	ctrlPoints.sort((a, b) => a.point.x - b.point.x)
	plot = PiGraph.bezier(ctrlPoints)

	changeEvent()
}


let {loadAnswerToKeyboard} = useKeyboard(props)
let reset = function () {
	removeAllItems()
}
defineExpose({
	reset,
	loadAnswer: (value) => {
		loadAnswerToKeyboard(value, reset, changeEvent, (value) => {
			value.split(',').forEach((item) => {

				// Adding points.
				const [x, y] = getCoordinates(item)

				if (x !== undefined && y !== undefined) {
					let type = item.split('(')[0]

					if (type === 'M') {
						type = "mm"
					}

					display.value.input = `(${x};${y})`
					addItemToGraph(type === "" ? 'p' : type)
				} else {
					// Plotting asymptotes
					// Adding asymptotes.
					let [equ, ...ctrls] = item.split('&'),
						a

					display.value.input = equ

					if (equ.substring(0, 2) === 'x=') {
						addItemToGraph('av')
					} else if (equ.match(/x/) && equ.match(/y/)) {
						addItemToGraph('ao')
					} else if (equ.substring(0, 2) === 'y=') {
						addItemToGraph('ah')
					}

					ctrls.forEach((key) => {
						itemsGraph.value[equ].controls[key].svg.fill("green")
					})
				}
			})

			plotGraph()
		})
	},
	parameters: "pleins de paramètres à donner..."
})
</script>
