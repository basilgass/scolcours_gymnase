<template>
	<Panel>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<form-input
				v-model="A"
				focus
				label="A ou équation BC"
				name="fonction"
			/>

			<form-input
				v-model="B"
				label="B ou équation AC"
				name="fonction"
			/>

			<form-input
				v-model="C"
				label="C ou équation AB"
				name="fonction"
			/>
		</div>

		<div
			v-if="result"
			class="my-10"
		>
			<h2 class="font-lg">
				sommets
			</h2>
			<div class="grid grid-cols-3">
				<div v-katex="`A=${result.triangle.A.tex}`" />
				<div v-katex="`B=${result.triangle.B.tex}`" />
				<div v-katex="`C=${result.triangle.C.tex}`" />
			</div>
			<h2 class="font-lg">
				droites
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
				<div v-katex="`(d_{AB}): ${result.triangle.lines.AB.tex.canonical}`" />
				<div v-katex="`(d_{AC}): ${result.triangle.lines.AC.tex.canonical}`" />
				<div v-katex="`(d_{BC}): ${result.triangle.lines.BC.tex.canonical}`" />
			</div>
			<h2 class="font-lg">
				médianes
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-baseline">
				<div v-katex="`(m_A): ${result.triangle.remarquables.medians.A.tex.canonical}`" />
				<div v-katex="`(m_B): ${result.triangle.remarquables.medians.B.tex.canonical}`" />
				<div v-katex="`(m_C): ${result.triangle.remarquables.medians.C.tex.canonical}`" />
				<div v-katex="`G=${result.triangle.remarquables.medians.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				médiatrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-baseline">
				<div v-katex="`(m_{AB}): ${result.triangle.remarquables.mediators.AB.tex.canonical}`" />
				<div v-katex="`(m_{AC}): ${result.triangle.remarquables.mediators.AC.tex.canonical}`" />
				<div v-katex="`(m_{BC}): ${result.triangle.remarquables.mediators.BC.tex.canonical}`" />
				<div v-katex="`P=${result.triangle.remarquables.mediators.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				hauteurs
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-baseline">
				<div v-katex="`(h_A): ${result.triangle.remarquables.heights.A.tex.canonical}`" />
				<div v-katex="`(h_B): ${result.triangle.remarquables.heights.B.tex.canonical}`" />
				<div v-katex="`(h_C): ${result.triangle.remarquables.heights.C.tex.canonical}`" />
				<div v-katex="`D=${result.triangle.remarquables.heights.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				bissectrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-baseline">
				<div v-katex="`(b_A): ${result.triangle.remarquables.bisectors.A.tex.canonical}`" />
				<div v-katex="`(b_B): ${result.triangle.remarquables.bisectors.B.tex.canonical}`" />
				<div v-katex="`(b_C): ${result.triangle.remarquables.bisectors.C.tex.canonical}`" />
				<div v-katex="`D=${result.triangle.remarquables.bisectors.intersection.tex}`" />
			</div>
		</div>
		<div
			v-else
			class="text-red-700 text-sm text-center mt-5"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>

<script setup>
/** Tools
 * title: droites remarquables d'un triangle
 * body: calcul des droites remarquables d'un triangle
 * parameters: a, b, c=coord ou équation
 * tags: geometrie,2M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"

let A = ref("15x-8y+16=0"),
	B = ref("3x-4y-6=0"),
	C = ref("5x+12y-24=0")

let result = computed(() => {
	try {
		let triangle = new PiMath.Geometry.Triangle(
			...A.value.split(","),
			...B.value.split(","),
			...C.value.split(",")
		)
		console.log(triangle)
		return {
			triangle: triangle
		}
	} catch (e) {
		// console.error(e)
		return false
	}
})
</script>
