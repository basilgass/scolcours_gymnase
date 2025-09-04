<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Equation, Point, PolyFactor, Polynom} from "pimath"
/** Tools
 * title: quadratique
 * body: calcul d'une fonction quadratique
 * parameters: a=Point, b=Point, c=Point (optionnel)
 * tags: algebre,1M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Point A",
		type: "text",
		value: ref("-2,-11"),
		fromUrl: "A"
	},
	{
		label: "Point B",
		type: "text",
		value: ref("0,-7"),
		fromUrl: "B"
	},
	{
		label: "Point C",
		type: "text",
		value: ref("-4,-7"),
		fromUrl: "C"
	}
])

const A = computed(() => forms[0].value.value as string)
const B = computed(() => forms[1].value.value as string)
const C = computed(() => forms[2].value.value as string)

function getPolyFromThreePoints(A, B, C): Polynom {
	const P = new Equation("y", "ax^2+bx+c"),
		pA = new Point(A),
		pB = new Point(B),
		pC = new Point(C)

	// y=ax^2+bx+c
	let Pc: Equation = P.clone()
			.replaceBy("x", new Polynom(pA.x.display))
			.replaceBy("y", new Polynom(pA.y.display))
			.isolate("c") as Equation,
		Pb: Equation = P.clone()
			.replaceBy("x", new Polynom(pB.x.display))
			.replaceBy("y", new Polynom(pB.y.display))
			.replaceBy("c", Pc.right)
			.isolate("b") as Equation,
		Pa

	if (C !== "") {
		Pa = P.clone()
			.replaceBy("x", new Polynom(pC.x.display))
			.replaceBy("y", new Polynom(pC.y.display))
			.replaceBy("c", Pc.right)
			.replaceBy("b", Pb.right)
			.isolate("a")
	} else {
		// Le point B est un sommet !
		// x = -b/2a => b = -2ax
		Pa = new Equation("b = -2a*x")
			.replaceBy("x", new Polynom(pC.x.display))

		Pa.left = Pb.right.clone()
		Pa.isolate("a")
	}

	Pb = Pb.replaceBy("a", Pa.right)
	Pc = Pc.replaceBy("b", Pb.right).replaceBy("a", Pa.right)

	return P.clone()
		.replaceBy("a", Pa.right)
		.replaceBy("b", Pb.right)
		.replaceBy("c", Pc.right)
		.right
}

const result = computed(() => {

	// two possibilities:
	// A,B,C are given as numbers => ax^2+bx+c
	// A only is given: it's the polynom !

	let poly: Polynom

	try {
		if (A.value.includes("^2")) {
			poly = new Polynom(A.value)
		} else if (!A.value.includes("x") &&
			!B.value.includes("x") &&
			!C.value.includes("x")) {

			poly = getPolyFromThreePoints(A.value, B.value, C.value)
		}

		const a = poly.monomByDegree(2).coefficient,
			b = poly.monomByDegree(1).coefficient,
			c = poly.monomByDegree(0).coefficient,
			delta = b.clone().pow(2).subtract(a.clone().multiply(c).multiply(4))

		const equ = new Equation(poly, 0)
		const solutions = equ.solve()

		const sx = b.clone().opposite().divide(a.clone().multiply(2)),
			sy = delta.clone().opposite().divide(a.clone().multiply(4))

		// Forme du sommet
		// a(x-sx)^2+sy
		const sommet = `${a.isOne() ? "" : a.isNegativeOne() ? "-" : a.tex}${sx.isZero() ? "x^2" : `\\left( x ${sx.clone().opposite().texWithSign} \\right)^2`}${sy.texWithSign}`

		return {
			tex: poly.tex,
			factorise: new PolyFactor().fromPolynom(poly).factorize().reduce().tex,
			sommet,
			points: {
				H: new Point(0, c).tex,
				S: `\\left( ${sx.tex}; ${sy.tex} \\right)`,
				Z: solutions.map(sol => sol.tex)
			}
		}
	} catch (e) {
		console.log(e)
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
			<div
				class="grid grid-cols-1 md:grid-cols-2 gap-5"
			>
				<div
					v-katex.display.boxed.lg="`f(x) = ${result.tex}`"
					class="col-span-2 text-lg my-10"
				/>

				<div>
					<h2 class="font-semibold">
						forme factorisée
					</h2>
					<div v-katex.display.boxed.lg="`f(x) = ${result.factorise}`" />

					<h2 class="font-semibold">
						forme du sommet
					</h2>
					<div v-katex.display.boxed.lg="`f(x) = ${result.sommet}`" />
				</div>

				<div>
					<h2 class="font-semibold">
						points caractéristiques
					</h2>

					<div class="grid grid-cols-2">
						<div v-katex.display.boxed.lg="`H = ${result.points.H}`" />
						<div v-katex.display.boxed.lg="`S = ${result.points.S}`" />
						<div
							v-for="(sol, idx) of result.points.Z"
							:key="sol"
							v-katex.display.boxed.lg="`z_${idx+1} = ${sol}`"
						/>
					</div>
				</div>
			</div>
		</Card>
		<tool-error v-else />
	</article>
</template>
