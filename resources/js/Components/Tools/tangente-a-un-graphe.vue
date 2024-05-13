<script lang="ts" setup>
/** Tools
 * title: tangente à un graphe (fonction polynomiale)
 * body: permet de calculer l'équation cartésienne d'une tangente à un graphe à un point d'abscisse donné.
 * parameters: fx=fonction polynomiale, x=abscisse du point de tangence
 * tags: algebre,2M
 */
import { computed, ref } from "vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { Line } from "pimath/dist/maths/geometry/line"
import { PiMath } from "pimath"
import type { Fraction } from "pimath/dist/maths/coefficients/fraction"
import { ISolution } from "pimath/dist/maths/algebra/equation"

const fx = ref("x^2"),
	x = ref("1,0")


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


			let sols: Line[] = equ.solutions
				.filter((sol: ISolution) => sol.exact !== false)
				.map((sol: ISolution) => {
					const x = sol.exact,
						y = P.evaluate(x as Fraction)

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
		<form-maker
			v-model="fx"
			focus
			label="fonction"
			name="fonction"
			from-url="fx"
		/>

		<form-maker
			v-model="x"
			label="abscisse du point de tangence ou coordonnée d'un point"
			name="x ou a,b"
			from-url="x"
		/>

		<div v-if="affine">
			<div v-katex="`${affine.tex.mxh}`" />
			<div v-katex="`${affine.tex.canonical}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
	</article>
</template>
