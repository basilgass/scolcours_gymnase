<template>
	<!-- Title -->
	<div ref="root">
		<h1 class="text-lg font-semibold">
			Keyboard - graph
		</h1>

		<div class="mx-auto max-w-md flex flex-col">
			<div
				ref="draw"
				class=" bg-white p-3"
			/>

			<div class="flex gap-4 w-full">
				<button
					class="btn"
					@click="addAV()"
				>
					AV
				</button>

				<button
					class="btn"
					@click="addAH()"
				>
					AH
				</button>

				<button
					class="btn"
					@click="addAO()"
				>
					AO
				</button>

				<button
					class="btn"
					@click="addMinMax()"
				>
					Min/Max
				</button>

				<button
					class="btn"
					@click="addThrough()"
				>
					Point
				</button>
			</div>
		</div>

		<button
			class="btn"
			@click="plotGraph"
		>
			Plot
		</button>
		<div
			v-if="outputTex.length>0"
			class="flex flex-wrap gap-4"
		>
			<div
				v-for="(item, index) of outputTex"
				:key="index"
				v-katex="item"
			/>
		</div>

		<div class="font-code min-h-[3em]">
			{{ answer }}
		</div>

		<div>
			<form-input
				v-model="genFx"
				name="fx"
				label="fonction à générer"
			/>

			<div class="flex w-full gap-3 mt-4">
				<button
					class="btn-xs btn-primary"
					@click="generateFromFx"
				>
					Générer
				</button>

				<div class="font-code">
					{{ genFxString }}
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}

</script>
<script setup>
import {onMounted, ref, reactive, computed, watch, nextTick} from "vue"
import {PiDraw} from "pidraw/esm"
import {PiMath} from "pimath/esm"
import FormInput from "@/Components/Form/FormInput.vue"
import {value} from "lodash/seq"

let reactiveCB = function () {
	asymptotesTex.value = asymptotes.map(x => x.tex)
}
let asymptote = class {
	constructor(atype, rcb, defaults) {
		const rnd = defaults === undefined ? PiMath.Random.numberSym(8, false) : defaults.value

		this.P = PiGraph.point(0, 0)
		this.Q = PiGraph.point(1, 1)
		this.line = PiGraph.line(this.P, this.Q)
		this.type = atype

		// Adding the "clickable buttons" on the extremities of the asymptote
		this.buttons = {
			LT: PiGraph.point(0, 0).asSquare(10).fill({color: "white", opacity: 0.5}).stroke("black").hideLabel(),
			LB: PiGraph.point(0, 0).asSquare(10).fill({color: "white", opacity: 0.5}).stroke("black").hideLabel(),
			RT: PiGraph.point(0, 0).asSquare(10).fill({color: "white", opacity: 0.5}).stroke("black").hideLabel(),
			RB: PiGraph.point(0, 0).asSquare(10).fill({color: "white", opacity: 0.5}).stroke("black").hideLabel(),
		}
		this.buttonsControls = {
			LT: PiGraph.point(0, 0).hide(),
			RT: PiGraph.point(0, 0).hide(),
			LB: PiGraph.point(0, 0).hide(),
			RB: PiGraph.point(0, 0).hide(),
		}

		let addClickEvt = (btn) => {
			btn.svg.on("click", (ev) => {
				if (btn.svg.fill() === "white") {
					btn.svg.fill("green")
				} else {
					btn.svg.fill("white")
				}
			})
		}

		addClickEvt(this.buttons.LT)
		addClickEvt(this.buttons.RT)
		addClickEvt(this.buttons.LB)
		addClickEvt(this.buttons.RB)


		const dragOptions = {
			grid: PiGraph.getGrid()
		}

		this.P.label.hide()
		this.Q.label.hide()

		let placeButtons

		// Placing objects
		if (atype === "av")
		{
			this.line.stroke("red")
			this.P.coord = {x: rnd, y: -10}
			this.Q.coord = {x: rnd, y: 1}

			this.buttons.LT.coord = {x: rnd - 1, y: 19}
			this.buttons.LB.coord = {x: rnd - 1, y: -19}
			this.buttons.RT.coord = {x: rnd + 1, y: 19}
			this.buttons.RB.coord = {x: rnd + 1, y: -19}

			this.buttonsControls.LT.coord = {x: rnd - 0.1, y: 30}
			this.buttonsControls.LB.coord = {x: rnd - 0.1, y: -30}
			this.buttonsControls.RT.coord = {x: rnd + 0.1, y: 30}
			this.buttonsControls.RB.coord = {x: rnd + 0.1, y: -30}

			this.Q.hide()
			dragOptions.constrain = "x"
			dragOptions.callback = (pt) => {
				this.Q.x = pt.x
				this.buttons.LT.x = pt.x - 20
				this.buttons.LB.x = pt.x - 20
				this.buttons.RT.x = pt.x + 20
				this.buttons.RB.x = pt.x + 20

				this.buttonsControls.LT.x = pt.x - 2
				this.buttonsControls.LB.x = pt.x - 2
				this.buttonsControls.RT.x = pt.x + 2
				this.buttonsControls.RB.x = pt.x + 2

				rcb()
			}
		} else if (atype === "ah")
		{
			this.line.stroke("green")
			this.P.coord = {x: -10, y: rnd}
			this.Q.coord = {x: 10, y: rnd}

			this.buttons.LT.coord = {x: -19, y: rnd + 1}
			this.buttons.LB.coord = {x: -19, y: rnd - 1}
			this.buttons.RT.coord = {x: 19, y: rnd + 1}
			this.buttons.RB.coord = {x: 19, y: rnd - 1}

			this.buttonsControls.LT.coord = {x: -30, y: rnd + 0.1}
			this.buttonsControls.LB.coord = {x: -30, y: rnd - 0.1}
			this.buttonsControls.RT.coord = {x: 30, y: rnd + 0.1}
			this.buttonsControls.RB.coord = {x: 30, y: rnd - 0.1}

			this.Q.hide()
			dragOptions.constrain = "y"
			dragOptions.callback = (pt) => {
				this.Q.y = pt.y
				this.buttons.LT.y = pt.y - 20
				this.buttons.LB.y = pt.y + 20
				this.buttons.RT.y = pt.y - 20
				this.buttons.RB.y = pt.y + 20

				this.buttonsControls.LT.y = pt.y - 2
				this.buttonsControls.LB.y = pt.y + 2
				this.buttonsControls.RT.y = pt.y - 2
				this.buttonsControls.RB.y = pt.y + 2
				rcb()
			}
		} else if (atype === "ao")
		{
			this.line.stroke("blue")

			if (defaults === undefined) {
				this.P.coord = {x: rnd - 3, y: rnd}
				this.Q.coord = {x: 0, y: rnd + 1}
			} else {
				this.P.coord = {x: 1, y: defaults.ordonnee + defaults.value}
				this.Q.coord = {x: 0, y: defaults.ordonnee}
			}

			placeButtons = (mathLine) => {
				let posStart = 100,
					posEnd = PiGraph.width - posStart,
					normalVector = mathLine.normal

				let startCoords = {x: posStart, y: mathLine.getValueAtX(posStart).value},
					endCoords = {x: posEnd, y: mathLine.getValueAtX(posEnd).value},
					startOverflow = mathLine.getValueAtX(0).value,
					endOverflow = mathLine.getValueAtX(PiGraph.width).value

				if (startOverflow < 0 || startOverflow > PiGraph.height) {
					let y = startOverflow < 0 ? posStart : posEnd
					startCoords = {x: mathLine.getValueAtY(y).value, y}
				}

				if (endOverflow < 0 || endOverflow > PiGraph.height) {
					let y = endOverflow < 0 ? posStart : posEnd
					endCoords = {x: mathLine.getValueAtY(y).value, y}
				}

				let norm = normalVector.norm,
					sign = this.P.x > this.Q.x ? -1 : 1,
					dx = sign * normalVector.x.value / norm * 20,
					dy = sign * normalVector.y.value / norm * 20

				// Place buttons at -oo
				this.buttons.LT.x = startCoords.x + dx
				this.buttons.LT.y = startCoords.y + dy
				this.buttons.LB.x = startCoords.x - dx
				this.buttons.LB.y = startCoords.y - dy

				// Place buttons at +oo
				this.buttons.RT.x = endCoords.x + dx
				this.buttons.RT.y = endCoords.y + dy
				this.buttons.RB.x = endCoords.x - dx
				this.buttons.RB.y = endCoords.y - dy

				// Build the control points
				this.buttonsControls.LT.x = 2*this.buttons.RT.x - this.buttons.LT.x - dx/10
				this.buttonsControls.LT.y = 2*this.buttons.RT.y - this.buttons.LT.y - dy/10
				this.buttonsControls.LB.x = 2*this.buttons.RB.x - this.buttons.LB.x + dx/10
				this.buttonsControls.LB.y = 2*this.buttons.RB.y - this.buttons.LB.y + dy/10

				this.buttonsControls.RT.x = 2*this.buttons.LT.x - this.buttons.RT.x - dx/10
				this.buttonsControls.RT.y = 2*this.buttons.LT.y - this.buttons.RT.y - dx/10
				this.buttonsControls.RB.x = 2*this.buttons.LB.x - this.buttons.RB.x + dx/10
				this.buttonsControls.RB.y = 2*this.buttons.LB.y - this.buttons.RB.y + dx/10
			}

			dragOptions.callback = (pt) => {
				placeButtons(this.line.math)
				rcb()
			}

			this.Q.draggable({
				...dragOptions,
				constrain: "y"
			})
		}

		this.line.update()
		this.buttons.LT.update()
		this.buttons.RT.update()
		this.buttons.LB.update()
		this.buttons.RB.update()

		if (defaults !== undefined) {
			defaults.position.forEach(key => {
				this.buttons[key].svg.fill("green")
			})
		}

		// Update the buttons placement
		if (placeButtons) {
			placeButtons(this.line.math)
		}

		this.P.draggable(dragOptions)
	}

	addClickableButtons() {

	}

	get tex() {
		return this.line.texMath
	}

	get display() {
		return this.line.display.mxh
	}

	get selected() {
		// The point for the control must be farther and more near of the line
		let arr = []
		for (let key in this.buttons) {
			if (this.buttons[key].svg.fill() === "green") {
				arr.push({
					position: key,
					x: this.buttonsControls[key].x,
					type: "asymptote",
					point: this.buttonsControls[key],
					control: this.type === "ao" ? "smooth" : this.type,
					ratio: 0.5
				})
			}
		}

		return arr.sort((a, b) => a.position < b.position)
	}

}
let apoint = class {
	constructor(atype, rcb, draggable, defaults) {
		console.log(defaults)
		if (defaults === undefined) {
			this.point = PiGraph.point(
				PiMath.Random.numberSym(8, false),
				PiMath.Random.numberSym(8, false)
			).hideLabel()
		} else {
			this.point = PiGraph.point(
				defaults.x,
				defaults.y
			).hideLabel()

			if (atype === "asymptote") {
				this.point.asSquare(10).fill({color: "white", opacity: 0.5})
			}
		}

		this.type = atype

		this.line = PiGraph.path().stroke({color: "purple", width: 2, opacity: 0.5})

		let updateLine = (pt) => {
			if (this.type === "extremum") {
				this.line.plot(`M${pt.x - 80},${pt.y} L${pt.x + 80},${pt.y}`)
			}
		}
		updateLine(this.point)

		if (draggable === undefined || draggable) {
			this.point.draggable({
				grid: PiGraph.getGrid(),
				callback: (pt) => {
					updateLine(pt)
					rcb()
				}
			})
		}

	}

	get x() {
		return this.point.x
	}

	get control() {
		return this.type === "extremum" ? "flat" : "smooth"
	}

	get tex() {
		return this.point.coordAsTex
	}

	get display() {
		let P = this.point.coord
		return `(${P.x};${P.y})`
	}

	get ratio() {
		return this.type === "extremum" ? 0.6 : 0.3
	}
}

let PiGraph
let root = ref(null),
	draw = ref(null),
	asymptotes = [],
	points = [],
	dftPoints = [],
	asymptotesTex = ref([]),
	outputTex = ref([]),
	answer = ref(""),
	plots = ref([]),
	genFx = ref("(x+5)(2x-10)/2x-3"),
	genFxString = ref(""),
	addAV = function (value) {
		asymptotes.push(new asymptote("av", reactiveCB, value))
	},
	addAH = function (value) {
		asymptotes.push(new asymptote("ah", reactiveCB, value))
	},
	addAO = function (value) {
		asymptotes.push(new asymptote("ao", reactiveCB, value))
	},
	addMinMax = function (value) {
		points.push(new apoint("extremum", reactiveCB, true, value))
	},
	addThrough = function (value) {
		points.push(new apoint("through", reactiveCB, true, value))
	},
	plotGraph = function () {
		// On arrange les valeurs dans "l'ordre"
		asymptotes.sort((a, b) => b.display < a.display)
		points.sort((a, b) => a.x - b.x)

		// Construction de la réponse pour comparaison.
		answer.value = [
			...asymptotes.map(x => {
				let btnSelection = x.selected.map(a => a.position).join(";")

				return `${x.display};${btnSelection}`
			}),
			...points.map(x => {
				if (x.type === "extremum") {
					return `m${x.display}`
				} else if (x.type === "through") {
					if (x.point.coord.x === 0) {
						return `o${x.point.coord.y}`
					}
					if (x.point.coord.y === 0) {
						return `z${x.point.coord.x}`
					}

					return x.display
				}
			})
		].sort().join(",")

		// Construction du visuel Tex des différents points et asymptotes.
		outputTex.value = [
			...asymptotes.map(x => x.tex.mxh),
			...points.sort((a, b) => a.type !== b.type ? a.type === "through" : a.x < b.x).map(x => {
				if (x.type === "extremum") {
					return `\\text{extrema}${x.tex}`
				} else if (x.type === "through") {
					return x.tex
				}

				return "?"
			})
		]

		// Construction du visuel graphique
		// Get all points through, min/max and asymptotes
		let arr = [...points]
		for (let a of asymptotes) {
			arr = arr.concat(...a.selected)
			console.log(a.selected)
		}
		for (let a of dftPoints.filter(x => x.point.svg.fill() === "green")) {
			arr.push(a)
		}

		// toutes les références sont mis dans l'ordre, de gauche à droite.
		arr.sort((a, b) => a.x - b.x)
		// On supprime tous les "morceaux" qui ont été créé.
		for (let p of plots.value) p.remove()
		plots.value = []

		// Génération des différents morceaux du graphe.
		let plotPts = []
		for (let pt of arr) {
			plotPts.push(pt)
			if (plotPts.length > 1 && pt.type === "asymptote") {
				plots.value.push(
					PiGraph.bezier(plotPts.map(pt => {
						return {
							point: pt.point,
							control: pt.control,
							ratio: pt.ratio
						}
					}))
				)
				// Reset the buttons.
				plotPts = []
			}
		}
	}

function generateFromFx() {
	// Make the rational polynom from a string
	let numden = genFx.value.split("/"),
		F

	if (numden.length === 2) {
		F = new PiMath.Rational(...numden)
	} else {
		F = new PiMath.Rational(numden[0], new PiMath.Polynom(1))
	}

	// Build the study object
	let study = F.study()

	let parts = []

	// Get the asymptotes
	// TODO: remove point through if it's already a min/max
	parts = parts.concat(
		study.asymptotes.map(a => `${a.display};${a.position.sort().join(";")}`),	// asymptotes
		study.zeroes.filter(z => z.type === "z").map(z => `z${z.display}`),				// zeroes
		Object.values(study.derivative.extremes).map(e => `m(${e.tex.x};${e.tex.y})`)	// point through asymptotes
	)

	if (!study.zeroes.filter(z => z.type === "d").map(z => z.value).includes(0)) {
		parts.push(`o${study.fx.evaluate(0).display}`)
	}

	genFxString.value = parts.sort().join(",")

	// On construit maintenant les différents points sur le graphiques.
	for (let a of study.asymptotes) {
		if (a.type === "ah") {
			addAH({
				value: a.fx.monomByDegree(0).coefficient.value,
				position: a.position
			})
		} else if (a.type === "av") {
			addAV({
				value: a.zero.value,
				position: a.position
			})
		} else if (a.type === "ao") {
			addAO({
				value: a.fx.monomByDegree(1).coefficient.value,
				ordonnee: a.fx.monomByDegree(0).coefficient.value,
				position: a.position
			})
		}
	}
	// Go through the min/max
	for (let z of Object.values(study.derivative.extremes)) {
		addMinMax({
			x: z.tex.x,
			y: z.tex.y
		})
	}
	for (let z of study.zeroes) {
		if (z.type === "d") {
			continue
		}
		addThrough({
			x: z.value,
			y: 0
		})
	}
	// Ordonnée
	// TODO: handle much better all these stuff !
	addThrough({
		x: 0,
		y: study.fx.evaluate(0).value
	})
}

onMounted(() => {
	PiGraph = new PiDraw(draw.value, {
		width: 800,
		height: 800,
		origin: {
			x: 400,
			y: 400
		},
		grid: {
			x: 20,
			y: 20
		}
	})
	PiGraph.axis()

	// Add the square at the corner.
	let LT = new apoint("asymptote", null, false, {x: -19, y: 19}),
		RT = new apoint("asymptote", null, false, {x: 19, y: 19}),
		LB = new apoint("asymptote", null, false, {x: -19, y: -19}),
		RB = new apoint("asymptote", null, false, {x: 19, y: -19})

	function addBtnEvent(ev) {
		if (this.fill() === "white") {
			this.fill("green")
		} else {
			this.fill("white")
		}
	}

	LT.point.svg.on("click", addBtnEvent)
	RT.point.svg.on("click", addBtnEvent)
	LB.point.svg.on("click", addBtnEvent)
	RB.point.svg.on("click", addBtnEvent)

	dftPoints = [LT, RT, LB, RB]
})

</script>

