<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Equation, Line, Point, Triangle} from "pimath"
/** Tools
 * title: droites remarquables d'un triangle
 * body: calcul des droites remarquables d'un triangle
 * parameters: a, b, c=coord ou équation
 * tags: geometrie,2M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
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

let A = computed(() => forms[0].value.value as string)
const B = computed(() => forms[1].value.value as string)
const C = computed(() => forms[2].value.value as string)

let result = computed(() => {

	try {
		let triangle = new Triangle()

		if (
			A.value.includes(',') &&
			B.value.includes(',') &&
			C.value.includes(',')
		) {
			triangle.fromPoints(
				new Point(...A.value.split(",")),
				new Point(...B.value.split(",")),
				new Point(...C.value.split(",")),
			)
		} else if (
			A.value.includes('=') &&
			B.value.includes('=') &&
			C.value.includes('=')
		) {
			triangle.fromLines(
				new Line().fromEquation(new Equation(A.value)),
				new Line().fromEquation(new Equation(B.value)),
				new Line().fromEquation(new Equation(C.value)),
			)
		} else {
			return false
		}

		return {
			triangle: triangle,
			heights: triangle.getHeights(),
			medians: triangle.getMedians(),
			mediators: triangle.getMediators(),
			bisectors: triangle.getBisectors(),
			extBisectors: triangle.getBisectors(false),
		}
	} catch {
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

		<Card v-if="result">
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
				<div v-katex.boxed="`(m_A): ${result.medians.A.tex}`" />
				<div v-katex.boxed="`(m_B): ${result.medians.B.tex}`" />
				<div v-katex.boxed="`(m_C): ${result.medians.C.tex}`" />
				<div v-katex.boxed="`G=${result.medians.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				médiatrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(m_{AB}): ${result.mediators.c.tex}`" />
				<div v-katex.boxed="`(m_{AC}): ${result.mediators.b.tex}`" />
				<div v-katex.boxed="`(m_{BC}): ${result.mediators.a.tex}`" />
				<div v-katex.boxed="`P=${result.mediators.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				hauteurs
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(h_A): ${result.heights.A.tex}`" />
				<div v-katex.boxed="`(h_B): ${result.heights.B.tex}`" />
				<div v-katex.boxed="`(h_C): ${result.heights.C.tex}`" />
				<div v-katex.boxed="`D=${result.heights.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				bissectrices
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(b_A): ${result.bisectors.A.tex}`" />
				<div v-katex.boxed="`(b_B): ${result.bisectors.B.tex}`" />
				<div v-katex.boxed="`(b_C): ${result.bisectors.C.tex}`" />
				<div v-katex.boxed="`D=${result.bisectors.intersection.tex}`" />
			</div>
			<h2 class="font-lg">
				bissectrices extérieures
			</h2>
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 items-baseline">
				<div v-katex.boxed="`(b_A'): ${result.extBisectors.A.tex}`" />
				<div v-katex.boxed="`(b_B'): ${result.extBisectors.B.tex}`" />
				<div v-katex.boxed="`(b_C'): ${result.extBisectors.C.tex}`" />
			</div>
		</Card>
		<tool-error v-else />
	</article>
</template>
