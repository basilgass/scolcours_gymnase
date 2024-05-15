<script lang="ts" setup>
/** Tools
 * title: quadratique
 * body: calcul d'une fonction quadratique
 * parameters: a=Point, b=Point, c=Point (optionnel)
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import type { Polynom } from "pimath/dist/maths/algebra/polynom"
import type { Equation } from "pimath/dist/maths/algebra/equation"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"

const forms: IToolForm[] = [
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
]

const A = computed(()=>forms[0].value.value as string)
const	B = computed(()=>forms[1].value.value as string)
const	C = computed(()=>forms[2].value.value as string)

function getPolyFromThreePoints(A, B, C): Polynom {
	const P = new PiMath.Equation("y", "ax^2+bx+c"),
		pA = new PiMath.Geometry.Point(A),
		pB = new PiMath.Geometry.Point(B),
		pC = new PiMath.Geometry.Point(C)

	// TODO: améliorer le calcul et inclure dans PI
	// y=ax^2+bx+c
	let Pc: Equation = P.clone()
			.replaceBy("x", new PiMath.Polynom(pA.x.display))
			.replaceBy("y", new PiMath.Polynom(pA.y.display))
			.isolate("c") as Equation,
		Pb: Equation = P.clone()
			.replaceBy("x", new PiMath.Polynom(pB.x.display))
			.replaceBy("y", new PiMath.Polynom(pB.y.display))
			.replaceBy("c", Pc.right)
			.isolate("b") as Equation,
		Pa

	// console.log(Pc.tex)
	// console.log(Pb.tex)
	if (C !== "") {
		Pa = P.clone()
			.replaceBy("x", new PiMath.Polynom(pC.x.display))
			.replaceBy("y", new PiMath.Polynom(pC.y.display))
			.replaceBy("c", Pc.right)
			.replaceBy("b", Pb.right)
			.isolate("a")
	} else {
		// Le point B est un sommet !
		// x = -b/2a => b = -2ax
		Pa = new PiMath.Equation("b = -2a*x")
			.replaceBy("x", new PiMath.Polynom(pC.x.display))

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
			poly = new PiMath.Polynom(A.value)
		} else if (!A.value.includes("x") &&
			!B.value.includes("x") &&
			!C.value.includes("x")) {

			poly = getPolyFromThreePoints(A.value, B.value, C.value)
		}

		const a = poly.monomByDegree(2).coefficient,
			b = poly.monomByDegree(1).coefficient,
			c = poly.monomByDegree(0).coefficient,
			delta = b.clone().pow(2).subtract(a.clone().multiply(c).multiply(4))

		const equ = new PiMath.Equation(poly, 0)
		equ.solve()

		const sx = b.clone().opposed().divide(a.clone().multiply(2)),
			sy = delta.clone().opposed().divide(a.clone().multiply(4))

		// Forme du sommet
		// a(x-sx)^2+sy
		const sommet = `${a.isOne()?'':a.isNegativeOne()?'-':a.tex}${sx.isZero()?'x^2':`\\left( x ${sx.clone().opposed().texWithSign} \\right)^2`}${sy.texWithSign}`

		return {
			tex: poly.tex,
			factorise: poly.texFactors,
			sommet,
			points: {
				H: new PiMath.Geometry.Point(0, c).tex,
				S: `\\left( ${sx.tex}; ${ sy.tex} \\right)`,
				Z: equ.solutions.map(sol=>sol.tex)
			}
		}
	} catch (e) {
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
			class="grid grid-cols-1 md:grid-cols-2 gap-5"
		>
			<div
				class="col-span-2 text-lg my-10"
				v-katex.display.boxed.lg="`f(x) = ${result.tex}`"
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
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>
