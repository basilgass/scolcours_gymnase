<script setup>
/** Tools
 * title: diagramme de Venn
 * body: permet d'afficher le résultat d'une expression sous forme de diagramme de Venn
 * parameters: exp=expression
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"

import { computed, onMounted, ref } from "vue"
import { PiMath } from "pimath/esm"
import { PiDraw } from "pidraw/esm"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let draw = ref(null),
	geom,
	venn,
	tex = computed(()=>{
		let P = ""
		try {
			P = new PiMath.Logicalset(input.value.replaceAll("uu", "|").replaceAll("nn", "&").replaceAll("not", "!"))
			updateVenn(P)
			P = P.tex
		}catch(e){
			P = "\\text{ expression non reconnue }"
		}
		return P
	}),
	result = ref([]),
	input = ref("")

function updateVenn(P){
	result.value = P.vennABC()
	for(let key in venn){
		venn[key].selected = result.value.includes(key)
		venn[key].shape.svg.fill(venn[key].selected ? "#cfc" : "#fff")
	}
}

function generateSVG() {
	geom = new PiDraw(draw.value, {width: 470, height:470,
		grid: {
			x: 42,
			y: 42
		},
		origin: {
			x: 30,
			y: 480
		}
	})
	geom.getGrid().hide()

	const E = geom.path("m 10,10 l450,0 0,450 l-450,0 z").fill("blue"),
		A = geom.path("M117.09765999999999 192.28125A118.57143 118.57143 0 0 0 49.158199999999994 299.49609A118.57143 118.57143 0 0 0 167.72852 418.06836A118.57143 118.57143 0 0 0 237.73046999999997 395.19921999999997A118.57143 118.57143 0 0 1 189.15819999999997 299.49609A118.57143 118.57143 0 0 1 190.55272999999994 281.35546999999997A118.57143 118.57143 0 0 1 117.09765999999993 192.28125Z ", "A"),
		B = geom.path("M350.9043 189.06641000000002A118.57143 118.57143 0 0 1 284.36132999999995 278.14258A118.57143 118.57143 0 0 1 286.30078 299.49609A118.57143 118.57143 0 0 1 237.73046999999997 395.20116999999993A118.57143 118.57143 0 0 0 307.72852 418.06836A118.57143 118.57143 0 0 0 426.30078000000003 299.49609A118.57143 118.57143 0 0 0 350.9043 189.06641000000002Z ", "B"),
		C = geom.path("M233.72852 52.35352A118.57143 118.57143 0 0 0 115.15820000000002 170.92578000000003A118.57143 118.57143 0 0 0 117.09766000000002 192.28125000000006A118.57143 118.57143 0 0 1 167.35547000000003 180.92578000000003A118.57143 118.57143 0 0 1 167.72852 180.92578000000003A118.57143 118.57143 0 0 1 237.73046999999997 203.79492000000005A118.57143 118.57143 0 0 1 307.72852 180.92578000000003A118.57143 118.57143 0 0 1 350.90430000000003 189.06641000000002A118.57143 118.57143 0 0 0 352.30078000000003 170.92578000000003A118.57143 118.57143 0 0 0 233.72852 52.35352000000003Z ", "C"),
		AB = geom.path("M284.36133 278.14258A118.57143 118.57143 0 0 1 233.72852 289.49609A118.57143 118.57143 0 0 1 190.55469 281.35546999999997A118.57143 118.57143 0 0 0 189.15819999999997 299.49609A118.57143 118.57143 0 0 0 237.72851999999995 395.19921999999997A118.57143 118.57143 0 0 0 286.3007799999999 299.49609A118.57143 118.57143 0 0 0 284.3613299999999 278.14257999999995Z ", "BC"),
		BC = geom.path("M307.35547 180.92577999999997A118.57143 118.57143 0 0 0 237.72852 203.79296999999997A118.57143 118.57143 0 0 1 284.36133 278.14061999999996A118.57143 118.57143 0 0 0 350.90430000000003 189.06640999999996A118.57143 118.57143 0 0 0 307.72852 180.92577999999997A118.57143 118.57143 0 0 0 307.35547 180.92577999999997Z ", "AB"),
		AC = geom.path("M167.35547000000003 180.92577999999997A118.57143 118.57143 0 0 0 117.09766000000002 192.28125A118.57143 118.57143 0 0 0 190.55273 281.35352A118.57143 118.57143 0 0 1 237.72852 203.79492A118.57143 118.57143 0 0 0 167.72852 180.92577999999997A118.57143 118.57143 0 0 0 167.35547000000003 180.92577999999997Z ", "AC"),
		ABC = geom.path("M237.85742 203.58202999999997A118.57143 118.57143 0 0 0 190.68164000000002 281.14453A118.57143 118.57143 0 0 0 233.85742000000005 289.28515999999996A118.57143 118.57143 0 0 0 284.48828000000003 277.93163999999996A118.57143 118.57143 0 0 0 237.85742000000005 203.58202999999997Z ", "ABC")

	// Ajout des textes
	const labels = [
		geom.point(2, 3, "A"),
		geom.point(8, 3, "B"),
		geom.point(5, 8, "C"),
		geom.point(1, 9, "E")
	]
	labels.forEach(pt=>{
		pt.hide().label.middle().center()
	})

	venn = {
		E: {shape: E, selected: false},
		A: {shape: A, selected: false},
		B: {shape: B, selected: false},
		C: {shape: C, selected: false},
		AB: {shape: AB, selected: false},
		AC: {shape: AC, selected: false},
		BC: {shape: BC, selected: false},
		ABC: {shape: ABC, selected: false}
	}

	for (let key in venn) {
		venn[key].shape.svg.fill("#fff")
		// .on("mouseover", function() {
		// 	this.animate(200).fill("#ddd")
		// })
		// .on("mouseleave", function () {
		// 	this.animate(200).fill(venn[key].selected ? "#cfc" : "#fff")
		// })
		// .on("click", function () {
		// 	venn[key].selected = !venn[key].selected
		// 	// let el = document.getElementById("vennCheck"+key+"_{{$name}}")
		// 	// el.checked = venn[key].selected
		// 	// el.dispatchEvent(new CustomEvent("change"))
		// 	this.fill(venn[key].selected ? "#cfc" : "#fff")
		// })
	}
}

onMounted(()=>{
	generateSVG()
})

</script>

<template>
	<Panel>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-3">
			<div class="flex flex-col gap-5">
				<div>
					<form-maker
						v-model="input"
						name="expression"
						label="expression"
					/>
				</div>
				<div v-katex="tex" />

				<keyboard-display
					v-model="input"
					class="mt-10 mt-auto mb-2"
					:keyboard="{
						grid: 'grid-cols-3',
						layout: [
							'A', 'B', 'C',
							'|', '&', '!',
							'-', '(', ')'
						]
					}"
					:custom-keys="{
						'A': {type: 'math', display: 'A'},
						'B': {type: 'math', display: 'B'},
						'C': {type: 'math', display: 'C'},
						'|': {type: 'math', display: '\\cup'},
						'&': {type: 'math', display: '\\cap'},
						'!': {type: 'math', display: '\\overline{\\textcolor{lightgray}{A}}'},
						'-': {type: 'math', display: '\\textcolor{lightgray}{A}\\setminus{\\textcolor{lightgray}{B}}'},

					}"
				/>
			</div>
			<div
				ref="draw"
				class="max-w-lg"
			/>
		</div>
	</Panel>
</template>
