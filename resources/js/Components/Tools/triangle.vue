<script lang="ts" setup>
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Line, Triangle } from "pimath"
/** Tools
 * title: droites remarquables d'un triangle
 * body: calcul des droites remarquables d'un triangle
 * parameters: a, b, c=coord ou équation
 * tags: geometrie,2M
 */
import { computed, ref } from "vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "A ou équation BC",
		type: "text",
		value: ref("15x-8y+16=0"),
		fromUrl: "a"
	},
	{
		label: "B ou équation AC",
		type: "text",
		value: ref("3x-4y-6=0"),
		fromUrl: "b"
	},
	{
		label: "C ou équation AB",
		type: "text",
		value: ref("5x+12y-24=0"),
		fromUrl: "c"
	}
])

let A = computed(()=>forms[0].value.value as string)
const B = computed(()=>forms[1].value.value as string)
const C = computed(()=>forms[2].value.value as string)

let result = computed(() => {
	try {
		let triangle = new Triangle(
			...A.value.split(","),
			...B.value.split(","),
			...C.value.split(",")
		)

		return {
			triangle: triangle,
			extBissectors: {
				A: new Line(triangle.A, triangle.remarquables.bisectors.A.d, "perpendicular"),
				B: new Line(triangle.B, triangle.remarquables.bisectors.B.d, "perpendicular"),
				C: new Line(triangle.C, triangle.remarquables.bisectors.C.d, "perpendicular")
			}
		}
	} catch (e) {
		// console.error(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form
			:forms="forms"
			form-class="grid grid-cols-1 md:grid-cols-3 gap-3"
		/>

		<div
			v-if="result"
			class="my-10"
		>
			<h2 class="font-lg">
				sommets
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-3 gap-3">
				<div v-katex.boxed="`A=${result.triangle.A.tex}`" />
				<div v-katex.boxed="`B=${result.triangle.B.tex}`" />
				<div v-katex.boxed="`C=${result.triangle.C.tex}`" />
			</div>
			<h2 class="font-lg">
				droites
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
				<div v-katex.boxed="`(d_{AB}): ${result.triangle.lines.AB.tex}`" />
				<div v-katex.boxed="`(d_{AC}): ${result.triangle.lines.AC.tex}`" />
				<div v-katex.boxed="`(d_{BC}): ${result.triangle.lines.BC.tex}`" />
			</div>
			<h2 class="font-lg">
				médianes
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(m_A): ${result.triangle.remarquables.medians.A.tex}`" />
				<div v-katex.boxed="`(m_B): ${result.triangle.remarquables.medians.B.tex}`" />
				<div v-katex.boxed="`(m_C): ${result.triangle.remarquables.medians.C.tex}`" />
				<div v-katex.boxed="`G=${result.triangle.remarquables.medians.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				médiatrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(m_{AB}): ${result.triangle.remarquables.mediators.AB.tex}`" />
				<div v-katex.boxed="`(m_{AC}): ${result.triangle.remarquables.mediators.AC.tex}`" />
				<div v-katex.boxed="`(m_{BC}): ${result.triangle.remarquables.mediators.BC.tex}`" />
				<div v-katex.boxed="`P=${result.triangle.remarquables.mediators.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				hauteurs
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(h_A): ${result.triangle.remarquables.heights.A.tex}`" />
				<div v-katex.boxed="`(h_B): ${result.triangle.remarquables.heights.B.tex}`" />
				<div v-katex.boxed="`(h_C): ${result.triangle.remarquables.heights.C.tex}`" />
				<div v-katex.boxed="`D=${result.triangle.remarquables.heights.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				bissectrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(b_A): ${result.triangle.remarquables.bisectors.A.tex}`" />
				<div v-katex.boxed="`(b_B): ${result.triangle.remarquables.bisectors.B.tex}`" />
				<div v-katex.boxed="`(b_C): ${result.triangle.remarquables.bisectors.C.tex}`" />
				<div v-katex.boxed="`D=${result.triangle.remarquables.bisectors.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				bissectrices extérieures
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(b_A'): ${result.extBissectors.A.tex}`" />
				<div v-katex.boxed="`(b_B'): ${result.extBissectors.B.tex}`" />
				<div v-katex.boxed="`(b_C'): ${result.extBissectors.C.tex}`" />
			</div>
		</div>
		<div
			v-else
			class="text-red-700 text-sm text-center mt-5"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>
