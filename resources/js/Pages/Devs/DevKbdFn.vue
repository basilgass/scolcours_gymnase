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
					@click="addAV"
				>
					AV
				</button>

				<button
					class="btn"
					@click="addAH"
				>
					AH
				</button>

				<button
					class="btn"
					@click="addAO"
				>
					AO
				</button>

				<button
					class="btn"
					@click="addMinMax"
				>
					Min/Max
				</button>

				<button
					class="btn"
					@click="addThrough"
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
		<div v-if="outputTex.length>0">
			<div
				v-for="(item, index) of outputTex"
				:key="index"
				v-katex="item"
			/>
		</div>

		<div class="font-code">
			{{ answer }}
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
import {onMounted, ref, reactive, computed, watch} from "vue"
import {PiDraw} from "pidraw/esm"
import {PiMath} from "pimath/esm"

let reactiveCB = function(){
	asymptotesTex.value = asymptotes.map(x=>x.tex)
}
let asymptote = class {
	constructor(atype, rcb) {
		const rnd = PiMath.Random.numberSym(8,false)
		this.P = PiGraph.point(0, 0)
		this.Q = PiGraph.point(1, 1)
		this.line = PiGraph.line(this.P, this.Q)
		this.type = atype

		// Adding the "clickable buttons" on the extremities of the asymptote
		this.buttons = {
			TL : PiGraph.point(0,0).asSquare(10).fill({color: "white", opacity:0.5}).stroke("black").hideLabel(),
			TR : PiGraph.point(0,0).asSquare(10).fill({color: "white", opacity:0.5}).stroke("black").hideLabel(),
			BL : PiGraph.point(0,0).asSquare(10).fill({color: "white", opacity:0.5}).stroke("black").hideLabel(),
			BR : PiGraph.point(0,0).asSquare(10).fill({color: "white", opacity:0.5}).stroke("black").hideLabel(),
		}
		this.buttonsControls = {
			TL : PiGraph.point(0,0).hide(),
			TR : PiGraph.point(0,0).hide(),
			BL : PiGraph.point(0,0).hide(),
			BR : PiGraph.point(0,0).hide(),
		}

		let addClickEvt = (btn) => {
			btn.svg.on("click", (ev)=> {
				if(btn.svg.fill()==="white"){
					btn.svg.fill("green")
				}else{
					btn.svg.fill("white")
				}
			})
		}

		addClickEvt(this.buttons.TL)
		addClickEvt(this.buttons.TR)
		addClickEvt(this.buttons.BL)
		addClickEvt(this.buttons.BR)


		const dragOptions = {
			grid: PiGraph.getGrid()
		}

		this.P.label.hide()
		this.Q.label.hide()

		// Placing objects
		if (atype === "av")
		{
			this.line.stroke("red")
			this.P.coord = {x: rnd, y: -10}
			this.Q.coord = {x: rnd, y: 1}

			this.buttons.TL.coord = {x: rnd-1, y: 19}
			this.buttons.TR.coord = {x: rnd+1, y: 19}
			this.buttons.BL.coord = {x: rnd-1, y: -19}
			this.buttons.BR.coord = {x: rnd+1, y: -19}

			this.buttonsControls.TL.coord = {x: rnd-0.1, y: 30}
			this.buttonsControls.TR.coord = {x: rnd+0.1, y: 30}
			this.buttonsControls.BL.coord = {x: rnd-0.1, y: -30}
			this.buttonsControls.BR.coord = {x: rnd+0.1, y: -30}

			this.Q.hide()
			dragOptions.constrain = "x"
			dragOptions.callback = (pt) => {
				this.Q.x = pt.x
				this.buttons.TL.x = pt.x-20
				this.buttons.TR.x = pt.x+20
				this.buttons.BL.x = pt.x-20
				this.buttons.BR.x = pt.x+20

				this.buttonsControls.TL.x = pt.x-2
				this.buttonsControls.TR.x = pt.x+2
				this.buttonsControls.BL.x = pt.x-2
				this.buttonsControls.BR.x = pt.x+2

				rcb()
			}
		} else if (atype === "ah")
		{
			this.line.stroke("green")
			this.P.coord = {x: -10, y: rnd}
			this.Q.coord = {x: 10, y: rnd}

			this.buttons.TL.coord = {x: 19, y: rnd-1}
			this.buttons.TR.coord = {x: 19, y: rnd+1}
			this.buttons.BL.coord = {x: -19, y: rnd-1}
			this.buttons.BR.coord = {x: -19, y: rnd+1}

			this.buttonsControls.TL.coord = {x: 30, y: rnd-0.1}
			this.buttonsControls.TR.coord = {x: 30, y: rnd+0.1}
			this.buttonsControls.BL.coord = {x: -30, y: rnd-0.1}
			this.buttonsControls.BR.coord = {x: -30, y: rnd+0.1}

			this.Q.hide()
			dragOptions.constrain = "y"
			dragOptions.callback = (pt) => {
				this.Q.y = pt.y
				this.buttons.TL.y = pt.y-20
				this.buttons.TR.y = pt.y+20
				this.buttons.BL.y = pt.y-20
				this.buttons.BR.y = pt.y+20

				this.buttonsControls.TL.y = pt.y-2
				this.buttonsControls.TR.y = pt.y+2
				this.buttonsControls.BL.y = pt.y-2
				this.buttonsControls.BR.y = pt.y+2
				rcb()
			}
		} else if (atype === "ao")
		{
			this.line.stroke("blue")
			// Do something
			this.P.coord = {x: rnd-3, y: rnd}
			this.Q.coord = {x: 0, y: rnd+1}

			let placeButtons = (mathLine) => {
				let posStart = 100,
					posEnd = PiGraph.width - posStart,
					normalVector = mathLine.normal

				let startCoords = {x: posStart, y: mathLine.getValueAtX(posStart).value},
					endCoords = {x: posEnd, y: mathLine.getValueAtX(posEnd).value},
					startOverflow = mathLine.getValueAtX(0).value,
					endOverflow = mathLine.getValueAtX(PiGraph.width).value

				if(startOverflow<0 || startOverflow>PiGraph.height){
					let y = startOverflow<0?posStart:posEnd
					startCoords = {x: mathLine.getValueAtY(y).value, y}
				}

				if(endOverflow<0 || endOverflow>PiGraph.height){
					let y = endOverflow<0?posStart:posEnd
					endCoords = {x: mathLine.getValueAtY(y).value, y}
				}

				let norm = normalVector.norm,
					sign = this.P.x>this.Q.x?-1:1,
					dx = sign*normalVector.x.value / norm * 20,
					dy = sign*normalVector.y.value / norm * 20

				this.buttons.TL.x = startCoords.x - dx
				this.buttons.TL.y = startCoords.y - dy
				this.buttons.TR.x = startCoords.x + dx
				this.buttons.TR.y = startCoords.y + dy

				this.buttonsControls.TL.x = startCoords.x - dx
				this.buttonsControls.TL.y = startCoords.y - dy
				this.buttonsControls.TR.x = startCoords.x + dx
				this.buttonsControls.TR.y = startCoords.y + dy

				this.buttons.BL.x = endCoords.x - dx
				this.buttons.BL.y = endCoords.y - dy
				this.buttons.BR.x = endCoords.x + dx
				this.buttons.BR.y = endCoords.y + dy

				this.buttonsControls.BL.x = endCoords.x - dx
				this.buttonsControls.BL.y = endCoords.y - dy
				this.buttonsControls.BR.x = endCoords.x + dx
				this.buttonsControls.BR.y = endCoords.y + dy
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
		this.buttons.TL.update()
		this.buttons.TR.update()
		this.buttons.BL.update()
		this.buttons.BR.update()

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
		for(let key in this.buttons){
			if(this.buttons[key].svg.fill()==="green"){
				arr.push({
					x: this.buttonsControls[key].x,
					type: "asymptote",
					point: this.buttonsControls[key],
					control: this.type==="ao"?"smooth":this.type,
					ratio: 0.5
				})
			}
		}

		return arr
		// return Object.values(this.buttonsControls).filter(x=>x.svg.fill()==="green").map(pt=>{
		// 	return {
		// 		x: pt.x,
		// 		type: "asymptote",
		// 		point: pt,
		// 		control: this.type==="ao"?"smooth":this.type,
		// 		ratio: 0.5
		// 	}
		// })
	}

}
let apoint = class {
	constructor(atype, rcb, draggable) {
		if(typeof atype!=="string"){
			this.point = PiGraph.point(
				atype.x,
				atype.y
			).hideLabel().asSquare(10).fill({color: "white", opacity: 0.5})
			atype = "asymptote"
		}else{
			this.point = PiGraph.point(
				PiMath.Random.numberSym(8,false),
				PiMath.Random.numberSym(8,false)
			).hideLabel()
		}
		this.type = atype

		this.line = PiGraph.path().stroke({color: "purple", width: 2, opacity: 0.5})

		let updateLine = (pt)=>{
			if(this.type==="extremum") {
				this.line.plot(`M${pt.x - 80},${pt.y} L${pt.x + 80},${pt.y}`)
			}
		}
		updateLine(this.point)

		if(draggable===undefined || draggable) {
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
		return this.type==="extremum"?"flat":"smooth"
	}
	get tex() {
		return this.point.coordAsTex
	}

	get display() {
		let P = this.point.coord
		return `(${P.x};${P.y})`
	}

	get ratio() {
		return 0.3
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
	addAV = function () {
		asymptotes.push(new asymptote("av", reactiveCB))
	},
	addAH = function () {
		asymptotes.push(new asymptote("ah", reactiveCB))
	},
	addAO = function () {
		asymptotes.push(new asymptote("ao", reactiveCB))
	},
	addMinMax = function() {
		points.push(new apoint("extremum", reactiveCB))
	},
	addThrough = function() {
		points.push(new apoint("through", reactiveCB))
	},
	plotGraph = function() {
		asymptotes.sort((a,b)=>{
			return b.display<a.display
		})
		points.sort((a, b) => a.x-b.x)

		answer.value = [
			...asymptotes.map(x=>x.display),
			...points.map(x=> {
				if(x.type==="extremum") {
					return `m${x.display}`
				}else if(x.type==="through"){
					return x.display
				}

			})
		].join(",")
		outputTex.value = [
			...asymptotes.map(x=>x.tex),
			...points.map(x=> {
				if(x.type==="extremum") {
					return `\\text{Min/Max}${x.tex}`
				}else if(x.type==="through"){
					return x.tex
				}

				return "?"
			})
		]



		// Get all points through, min/max and asymptotes
		let arr = [...points]
		for(let a of asymptotes){
			arr = arr.concat(...a.selected)
		}
		for(let a of dftPoints.filter(x=>x.point.svg.fill()==="green")){
			arr.push(a)
		}

		arr.sort((a,b)=>a.x-b.x)

		for(let p of plots.value){
			p.remove()
		}
		plots.value = []


		let plotPts = []
		for(let pt of arr){
			plotPts.push(pt)
			if(plotPts.length>1 && pt.type==="asymptote"){
				plots.value.push(
					PiGraph.bezier(plotPts.map(pt=>{
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
	let TL = new apoint({x: -19, y: 19}, null, false),
		TR = new apoint({x: 19, y: 19}, null, false),
		BL = new apoint({x: -19, y: -19}, null, false),
		BR = new apoint({x: 19, y: -19}, null, false)

	function addBtnEvent(ev){
		if(this.fill()==="white"){
			this.fill("green")
		}else{
			this.fill("white")
		}
	}
	TL.point.svg.on("click", addBtnEvent)
	TR.point.svg.on("click", addBtnEvent)
	BL.point.svg.on("click", addBtnEvent)
	BR.point.svg.on("click", addBtnEvent)

	dftPoints = [TL, TR, BL, BR]
})

</script>

