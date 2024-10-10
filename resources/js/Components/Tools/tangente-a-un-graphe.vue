<script lang="ts" setup>
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Equation, Fraction, ISolution, Line, Monom, Point, Polynom } from "pimath"
/** Tools
 * title: tangente à un graphe (fonction polynomiale)
 * body: permet de calculer l'équation cartésienne d'une tangente à un graphe à un point d'abscisse donné.
 * parameters: fx=fonction polynomiale, x=abscisse du point de tangence
 * tags: algebre,2M
 */
import { computed, ref } from "vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
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
])

const fx = computed(() => forms[0].value.value as string)
const x = computed(() => forms[1].value.value as string)


const affine = computed<{ tex: { canonical: string, mxh: string } } | false>(() => {
	try {
		const P = new Polynom(fx.value)

		// The given x is a point
		if (x.value.includes(",")) {
			const [a, b] = x.value.split(",").map(y => new Fraction(y))

			const dP = P.clone().derivative()

			const equ = new Equation(
				P.clone().subtract(b),
				dP.clone().multiply(new Monom("x")).subtract(dP.clone().multiply(a))
			)

			const solutions = equ.solve()

			let sols: Line[] = solutions
				.filter((sol: ISolution) => sol.exact !== false)
				.map((sol: ISolution) => {
					const x: Fraction = sol.exact as Fraction,
						y: Fraction = P.evaluate(x) as Fraction

					return new Line(
						new Point(x, y),
						new Point(a, b)
					)
				})
			// y = mx + h => h = b - ma
			// solve equation P = P'(x)* x +

			return {
				tex: {
					mxh: sols.map(sol => sol.mxh.tex).join("\\text{ ou }"),
					canonical: sols.map(sol => sol.tex).join("\\text{ ou }")
				}
			}
		}

		// The given x is an abscissa
		const a = new Fraction(x.value),
			fa = P.evaluate(a) as Fraction

		const dP = P.derivative(),
			m: Fraction = dP.evaluate(a) as Fraction,
			h = fa.clone().subtract(m.clone().multiply(a))

		const L = new Line(`y=${m.display}x+(${h.display})`)
		return {
			tex: {
				mxh: L.mxh.tex,
				canonical: L.tex
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
