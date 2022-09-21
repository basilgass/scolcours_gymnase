<template>
	<!-- Title -->
	<div ref="root">
		<h1 class="text-lg font-semibold">
			Keyboard - graph
		</h1>

		<div class="max-w-md flex flex-col">
			<pi-draw-parser
				ref="graph"
				:draw="draw"
				@update="figures = $event"
			/>

			<button
				class="btn"
				@click="addAV"
			>
				Ajouter asymptote verticale
			</button>

			<button
				class="btn"
				@click="addAH"
			>
				Ajouter asymptote horizontale
			</button>

			<button
				class="btn"
				@click="addAO"
			>
				Ajouter asymptote oblique
			</button>
		</div>

		<textarea
			v-model="draw.code"
			class="w-1/3"
			rows="10"
		/>
	</div>
</template>
<script>
import LayoutMain from "@/Layouts/LayoutMain"

export default {
	layout: LayoutMain
}

</script>
<script setup>
import {ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser"

let root = ref(null),
	graph = ref(null),
	AV = ref([]),
	AH = ref([]),
	AO = ref([]),
	draw = ref({
		code: "O(0,0)->!,?\nx=line y=0->!\ny=line x=0->!\n"
	}),
	figures = ref({}),
	addAV = function () {
		const idx = AV.value.length + 1
		draw.value.code += `V${idx}(3,0)->drag\n`
		draw.value.code += `a${idx}=perp x,V${idx}\n`
		AV.value.push([`V${idx}`, `a${idx}`])
	},
	addAH = function () {
		const idx = AH.value.length + 1
		draw.value.code += `H${idx}(0,2)->drag\n`
		draw.value.code += `b${idx}=perp y,H${idx}\n`
		AH.value.push([`H${idx}`, `b${idx}`])
	},
	addAO = function () {
		const idx = AO.value.length + 1
		draw.value.code += `A${idx}(-2,-2)->drag\n`
		draw.value.code += `B${idx}(2,2)->drag\n`
		draw.value.code += `c${idx}=A${idx}B${idx}\n`
		AH.value.push([`A${idx}`, `B${idx}`, `c${idx}`])
	}
</script>

