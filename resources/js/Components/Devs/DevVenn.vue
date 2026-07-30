<script
	setup
	lang="ts"
>

import FormInput from "@/Components/Form/FormInput.vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import {PiGraph as PiDraw} from "pidraw"
import {LogicalSet} from "pimath"
import {computed, onMounted, reactive, ref} from "vue"
import ScButton from "@/Components/Ui/Button/scButton.vue"
import {Shape} from "@svgdotjs/svg.js"

const draw = ref<HTMLElement | null>(null)
let geom: PiDraw
type ensembles = 'E' | 'A' | 'B' | 'C' | 'AC' | 'AB' | 'BC' | 'ABC'
const venn = reactive<Record<ensembles, { shape: any, selected: boolean }>>({
	E: {shape: null, selected: false}, A: {shape: null, selected: false}, B: {shape: null, selected: false}, C: {shape: null, selected: false}, AB: {shape: null, selected: false}, AC: {shape: null, selected: false}, BC: {shape: null, selected: false}, ABC: {shape: null, selected: false}
})

const logical = computed<LogicalSet>(() => new LogicalSet(input.value.replaceAll("uu", "|").replaceAll("nn", "&").replaceAll("not", "!")))
const tex = computed(() => {
	try {
		return logical.value.tex
	} catch {
		return "\\text{ réponse non reconnue }"
	}
})
const result = ref<string[]>([])
const input = ref("A-B")

function updateVenn() {
	result.value = logical.value.vennABC()

	for (const key in venn) {
		venn[key as ensembles].selected = result.value.includes(key)
		venn[key as ensembles].shape.fill(venn[key as ensembles].selected ? "#cfc" : "#fff")
	}
}

// function generate() {
// 	let P = new PiMath.Logicalset("(A&B)|C")
// 	tex.value = P.tex
// 	result.value = P.vennABC()
// }

function generateSVG() {
	if (!draw.value) {
		return
	}
	geom = new PiDraw(draw.value, {
		width: 470, height: 470,
		origin: {
			x: 30,
			y: 480
		}
	})

	geom.layers.grids.hide()

	const E = geom.create.path("m 10,10 l450,0 0,450 l-450,0 z", "path_E")
	const A = geom.create.path("M117.09765999999999 192.28125A118.57143 118.57143 0 0 0 49.158199999999994 299.49609A118.57143 118.57143 0 0 0 167.72852 418.06836A118.57143 118.57143 0 0 0 237.73046999999997 395.19921999999997A118.57143 118.57143 0 0 1 189.15819999999997 299.49609A118.57143 118.57143 0 0 1 190.55272999999994 281.35546999999997A118.57143 118.57143 0 0 1 117.09765999999993 192.28125Z ", "path_A")
	const B = geom.create.path("M350.9043 189.06641000000002A118.57143 118.57143 0 0 1 284.36132999999995 278.14258A118.57143 118.57143 0 0 1 286.30078 299.49609A118.57143 118.57143 0 0 1 237.73046999999997 395.20116999999993A118.57143 118.57143 0 0 0 307.72852 418.06836A118.57143 118.57143 0 0 0 426.30078000000003 299.49609A118.57143 118.57143 0 0 0 350.9043 189.06641000000002Z ", "path_B")
	const C = geom.create.path("M233.72852 52.35352A118.57143 118.57143 0 0 0 115.15820000000002 170.92578000000003A118.57143 118.57143 0 0 0 117.09766000000002 192.28125000000006A118.57143 118.57143 0 0 1 167.35547000000003 180.92578000000003A118.57143 118.57143 0 0 1 167.72852 180.92578000000003A118.57143 118.57143 0 0 1 237.73046999999997 203.79492000000005A118.57143 118.57143 0 0 1 307.72852 180.92578000000003A118.57143 118.57143 0 0 1 350.90430000000003 189.06641000000002A118.57143 118.57143 0 0 0 352.30078000000003 170.92578000000003A118.57143 118.57143 0 0 0 233.72852 52.35352000000003Z ", "path_C")
	const AB = geom.create.path("M284.36133 278.14258A118.57143 118.57143 0 0 1 233.72852 289.49609A118.57143 118.57143 0 0 1 190.55469 281.35546999999997A118.57143 118.57143 0 0 0 189.15819999999997 299.49609A118.57143 118.57143 0 0 0 237.72851999999995 395.19921999999997A118.57143 118.57143 0 0 0 286.3007799999999 299.49609A118.57143 118.57143 0 0 0 284.3613299999999 278.14257999999995Z ", "path_BC")
	const BC = geom.create.path("M307.35547 180.92577999999997A118.57143 118.57143 0 0 0 237.72852 203.79296999999997A118.57143 118.57143 0 0 1 284.36133 278.14061999999996A118.57143 118.57143 0 0 0 350.90430000000003 189.06640999999996A118.57143 118.57143 0 0 0 307.72852 180.92577999999997A118.57143 118.57143 0 0 0 307.35547 180.92577999999997Z ", "path_AB")
	const AC = geom.create.path("M167.35547000000003 180.92577999999997A118.57143 118.57143 0 0 0 117.09766000000002 192.28125A118.57143 118.57143 0 0 0 190.55273 281.35352A118.57143 118.57143 0 0 1 237.72852 203.79492A118.57143 118.57143 0 0 0 167.72852 180.92577999999997A118.57143 118.57143 0 0 0 167.35547000000003 180.92577999999997Z ", "path_AC")
	const ABC = geom.create.path("M237.85742 203.58202999999997A118.57143 118.57143 0 0 0 190.68164000000002 281.14453A118.57143 118.57143 0 0 0 233.85742000000005 289.28515999999996A118.57143 118.57143 0 0 0 284.48828000000003 277.93163999999996A118.57143 118.57143 0 0 0 237.85742000000005 203.58202999999997Z ", "path_ABC")

	// Ajout des textes
	const labels = [
		geom.create.point({x: 2, y: 3}, "A", {html: false}),
		geom.create.point({x: 6.5, y: 3}, "B", {html: false}),
		geom.create.point({x: 4, y: 7}, "C", {html: false}),
		geom.create.point({x: 0, y: 9}, "E", {html: false})
	]
	labels.forEach(pt => {
		pt.shape.hide()
		pt.label?.position("mc")
	})

	venn.E = {shape: E, selected: false}
	venn.A = {shape: A, selected: false}
	venn.B = {shape: B, selected: false}
	venn.C = {shape: C, selected: false}
	venn.AB = {shape: AB, selected: false}
	venn.AC = {shape: AC, selected: false}
	venn.BC = {shape: BC, selected: false}
	venn.ABC = {shape: ABC, selected: false}

	for (const key in venn) {
		venn[key as ensembles].shape.fill("#fff")

		venn[key as ensembles].shape.shape
			.on("mouseover", function (this: Shape) {
				this.animate(200).fill("#ddd")
			})
			.on("mouseleave", function (this: Shape) {
				this.animate(200).fill(venn[key as ensembles].selected ? "#cfc" : "#fff")
			})
			.on("click", function (this: Shape) {
				venn[key as ensembles].selected = !venn[key as ensembles].selected
				this.fill(venn[key as ensembles].selected ? "#cfc" : "#fff")
				updateVenn()
			})
	}
}

function validate() {
	let count = 0
	for (const key in venn) {
		if (venn[key as ensembles].selected && result.value.includes(key)) {
			count++
		}
	}

	if (count === result.value.length) {
		alert("bravo")
	} else {
		alert(`${count} bonne(s) réponse(s)`)
	}
}

onMounted(() => {
	generateSVG()

	// generate()
})
</script>
<template>
	<div>
		<div>
			<FormInput
				v-model="input"
				name="Réponse"
				label="réponse"
				@update="updateVenn"
			/>
		</div>
		<div>
			Affichage : <span v-katex="tex" />
		</div>
		<div
			ref="draw"
			class="max-w-lg"
		/>
		<sc-button
			type="primary"
			@click="validate"
		>
			Valider
		</sc-button>

		<keyboard-display
			v-model="input"
			keyboard="venn@A,B,C"
		/>
	</div>
</template>
