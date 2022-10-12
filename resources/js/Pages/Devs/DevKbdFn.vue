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
			</div>
		</div>

		<div v-if="asymptotesTex.length>0">
			<div
				v-for="(item, index) of asymptotesTex"
				:key="index"
				v-katex="item"
			/>
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
	asymptotesTex.value = asymptotes.value.map(x=>x.tex)
}
let asymptote = class {
	constructor(atype, rcb) {
		const rnd = PiMath.Random.numberSym(8,false)
		this.P = PiGraph.point(0, 0)
		this.Q = PiGraph.point(1, 1)
		this.line = PiGraph.line(this.P, this.Q)

		const dragOptions = {
			grid: PiGraph.getGrid()
		}

		this.P.label.hide()
		this.Q.label.hide()

		// Placing objects
		if (atype === "av") {
			this.P.coord = {
				x: rnd,
				y: -10
			}
			this.Q.coord = {
				x: rnd,
				y: 1
			}

			this.Q.hide()
			dragOptions.constrain = "x"
			dragOptions.callback = (pt) => {
				this.Q.x = pt.x
				rcb()
			}
		} else if (atype === "ah") {
			this.P.coord = {
				x: -10,
				y: rnd
			}
			this.Q.coord = {
				x: 10,
				y: rnd
			}

			this.Q.hide()
			dragOptions.constrain = "y"
			dragOptions.callback = (pt) => {
				this.Q.y = pt.y
				rcb()
			}
		} else if (atype === "ao") {
			// Do something
			this.P.coord = {
				x: rnd-3,
				y: rnd
			}
			this.Q.coord = {
				x: rnd+3,
				y: rnd+1
			}

			dragOptions.callback = (pt) => {
				rcb()
			}

			this.Q.draggable(dragOptions)
		}

		this.line.update()

		this.P.draggable(dragOptions)
	}

	get tex() {
		return this.line.texMath.mxh
	}
}

let PiGraph
let root = ref(null),
	draw = ref(null),
	asymptotes = ref([]),
	asymptotesTex = ref([]),
	addAV = function () {
		asymptotes.value.push(new asymptote("av", reactiveCB))
	},
	addAH = function () {
		asymptotes.value.push(new asymptote("ah", reactiveCB))
	},
	addAO = function () {
		asymptotes.value.push(new asymptote("ao", reactiveCB))

		// let cb = (pt) => {
		// 		references.TL.x = pt.x + 20
		// 		references.TR.x = pt.x - 20
		// 		references.BL.x = pt.x + 20
		// 		references.BR.x = pt.x - 20
		//
		// 		AO.value[id].tex = AO.value[id].line.texMath.mxh
		// 	},
		// 	P = PiGraph.point(PiMath.Random.number(-10, 10), PiGraph.unitYDomain.min + 5)
		// 		.draggable({
		// 			grid: PiGraph.getGrid(),
		// 			callback: (pt) => cb(pt)
		// 		}),
		// 	Q = PiGraph.point(PiMath.Random.number(-10, 10), PiGraph.unitYDomain.max - 5)
		// 		.draggable({
		// 			grid: PiGraph.getGrid(),
		// 			callback: (pt) => cb(pt)
		// 		}),
		// 	references = {
		// 		P,
		// 		Q,
		// 		TL: PiGraph.point(P.coord.x - 1, PiGraph.unitYDomain.max + 1),
		// 		TR: PiGraph.point(P.coord.x + 1, PiGraph.unitYDomain.max + 1),
		// 		BL: PiGraph.point(P.coord.x - 1, PiGraph.unitYDomain.min - 1),
		// 		BR: PiGraph.point(P.coord.x + 1, PiGraph.unitYDomain.min - 1)
		// 	},
		// 	id = AO.value.length	//TODO: make a more and unique ID.
		//
		// // Remove the labels
		// // TODO: set it as clickable square.
		// for (let key in references) {
		// 	if (key !== "Q") {
		// 		references[key].label.hide()
		// 	}
		// }
		//
		// // Keep track of the values.
		// AO.value.push({
		// 	id,
		// 	tex: "",
		// 	references,
		// 	line: PiGraph.line(references.P, references.Q),
		// })
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
})

</script>

