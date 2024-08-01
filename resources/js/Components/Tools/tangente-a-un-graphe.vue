<script lang="ts" setup>
/** Tools
 * title: tangente à un graphe (fonction polynomiale)
 * body: permet de calculer l'équation cartésienne d'une tangente à un graphe à un point d'abscisse donné.
 * parameters: fx=fonction polynomiale, x=abscisse du point de tangence
 * tags: algebre,2M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"

const forms: IToolForm[] = [
	{
		label: "fonction",
		type: "text",
		value: ref("x^2"),
		fromUrl: "fx"
	},
	{
		label: "abscisse du point de tangence ou coordonnée d'un point",
		type: "text",
		value: ref("1,0"),
		fromUrl: "x"
	}
]

const fx = computed(()=> forms[0].value.value as string)
const x = computed(()=> forms[1].value.value as string)


const affine = computed(() => {
	try {
		const P = new PiMath.Polynom(fx.value)

		// The given x is a point
		if (x.value.includes(",")) {
			const [a, b] = x.value.split(",").map(y => new PiMath.Fraction(y))

			const dP = P.clone().derivative()

			const equ = new PiMath.Equation(
				P.clone().subtract(b),
				dP.clone().multiply(new PiMath.Monom("x")).subtract(dP.clone().multiply(a))
			)

			equ.solve()


			let sols: PiMath.Line = equ.solutions
				.filter((sol: PiMath.ISolution) => sol.exact !== false)
				.map((sol:PiMath.ISolution) => {
					const x = sol.exact,
						y = P.evaluate(x as PiMath.Fraction)

					return new PiMath.Geometry.Line(
						new PiMath.Geometry.Point(x, y),
						new PiMath.Geometry.Point(a, b)
					)
				})
			// y = mx + h => h = b - ma
			// solve equation P = P'(x)* x +

			return {
				tex: {
					mxh: sols.map(sol => sol.tex.mxh).join("\\text{ ou }"),
					canonical: sols.map(sol => sol.tex.canonical).join("\\text{ ou }")
				}
			}
		}

		// The given x is an abscissa
		const a = new PiMath.Fraction(x.value),
			fa = P.evaluate(a)

		const dP = P.derivative(),
			m = dP.evaluate(a),
			h = fa.clone().subtract(m.clone().multiply(a))

		return new PiMath.Geometry.Line(`y=${m.display}x+(${h.display})`)
	} catch {
		return false
	}

})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<div v-if="affine">
			<div v-katex.boxed.lg="`${affine.tex.mxh}`" />
			<div v-katex.boxed.lg="`${affine.tex.canonical}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
	</article>
</template>
