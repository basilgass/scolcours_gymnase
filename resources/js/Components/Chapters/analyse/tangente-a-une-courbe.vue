<template>
	<section ref="root">
		<table-of-contents
			ref="toc"
			class="space-y-10 katex-boxed"
			query=".chapter-menu"
		>
			<div class="max-w-md mx-auto pb-6 pt-2 px-10 border border-gray-400 rounded-xl mb-6">
				<form-input
					v-model="fx"
					label="fonction"
					name="fx"
					@keyup="calculerLaTangente"
				/>


				<form-fraction
					v-model="abscisse"
					label="abscisse"
					name="abscisse"
					@keyup="calculerLaTangente"
				>
					<div
						class="text-sm"
						v-text="error"
					/>
					<div v-katex.display="tangente.fxAsTex" />
				</form-fraction>

				<div class="justify-between grid grid-cols-2 gap-10">
					<button
						class="btn btn-xs bg-white hover:bg-blue-400 hover:border-blue-500 hover:text-white"
						@click="makeRandom()"
					>
						Rendre aléatoire
					</button>

					<button
						class="btn btn-xs bg-white hover:bg-blue-400 hover:border-blue-500 hover:text-white"
						@click="showAnswer=!showAnswer"
					>
						Afficher les réponses
					</button>
				</div>
			</div>

			<div class="bg-white rounded border-gray-400 p-4">
				<h2 class="chapter-menu text-lg mb-6">
					Point de tangence
				</h2>
				<div>
					Il faut calculer les coordonnées du point de tangence. Comme ce point se situe sur le graphe de la
					fonction, il suffit de calculer <span v-katex.inline="`f(${tangente.point.x.tex})`" /> pour
					déterminer la 2ème coordonnée.
				</div>
				<div
					v-show="showAnswer"
					v-katex="tangente.point.tex"
				/>
			</div>

			<div class="bg-white rounded border-gray-400 p-4">
				<h2 class="chapter-menu text-lg mb-6">
					Dérivée
				</h2>
				<div>Pour calculer la pente, on utilise la dérivée \(f'(x)\) de la fonction.</div>
				<div
					v-show="showAnswer"
					v-katex="`f'(x) = ${tangente.derivee.tex}`"
				/>
			</div>

			<div class="bg-white rounded border-gray-400 p-4">
				<h2 class="chapter-menu text-lg mb-6">
					Pente
				</h2>
				<div>
					La pente de la tangente se calcule en évaluant la dérivée au point d'abscisse <span
						v-katex.inline="tangente.point.x.tex"
					/>.
				</div>
				<div
					v-show="showAnswer"
					v-katex="`m = f'\\left(${tangente.point.x.tex}\\right) = ${tangente.pente.tex} \\implies y = ${tangente.pente.tex}x+h`"
				/>
			</div>

			<div class="bg-white rounded border-gray-400 p-4">
				<h2 class="chapter-menu text-lg mb-6">
					Ordonnée à l'origine
				</h2>
				<div>
					Pour déterminer entièrement l'équation de la tangente, il reste à calculer l'ordonnée à l'origine
					\(h\). Dans l'équation \(y=mx+\textcolor{red}{h}\), on isole la variable \(h\). On obtient \(h = y -
					mx\). On connaît <span v-katex="`x=${tangente.point.x.tex}`" />, <span
						v-katex="`y=${tangente.point.y.tex}`"
					/> et <span v-katex="`m=${tangente.pente.tex}`" />
				</div>
				<div
					v-show="showAnswer"
					v-katex="`h = y - m\\cdot x = ${tangente.point.y.tex} - \\left( ${tangente.pente.tex}\\cdot ${tangente.point.x.tex} \\right) = ${tangente.ordonnee.tex}`"
				/>
			</div>

			<div class="bg-white rounded border-gray-400 p-4">
				<h2 class="chapter-menu text-lg mb-6">
					Equation de la tangente
				</h2>
				<div>Il ne reste plus qu'a à donner l'équation de la tangente.</div>
				<div
					v-show="showAnswer"
					v-katex="tangente.equation"
				/>
			</div>
		</table-of-contents>
	</section>
</template>

<script setup>/** Chapter
 * title: tangente à une courbe
 * body: Calcul de l'équation d'une tangente passant par un point d'abscisse donné.
 */
import {reactive, ref} from "vue"
import FormInput from "@/Components/Form/FormInput"
import {Polynom} from "pimath/esm/maths/algebra/polynom"
import FormFraction from "@/Components/Form/FormFraction"
import TableOfContents from "@/Components/Ui/TableOfContents"
import {Fraction} from "pimath/esm/maths/coefficients/fraction"
import {Monom} from "pimath/esm/maths/algebra/monom"
import {Random} from "pimath/esm/maths/randomization/random"

let root = ref(null),
	fx = ref("3x^2+5x-4"),
	abscisse = ref(3),
	error = ref(""),
	tangente = reactive({
		fxAsTex: "",
		point: {x: 0, y: 0, tex: ""},
		pente: "",
		ordonnee: "",
		equation: "",
		derivee: ""
	}),
	showAnswer = ref(false)

async function calculerLaTangente() {
	let P, x, y

	error.value = ""

	try {
		P = new Polynom(fx.value)
	} catch {
		error.value = "La fonction n'est pas reconnue."
		return
	}

	try {
		x = new Fraction(abscisse.value)
		y = P.evaluate(abscisse.value)
	} catch {
		error.value = "L'abscisse n'est pas reconnue."
		return
	}

	tangente.fxAsTex = `f(x) = ${P.tex}`
	tangente.point.x = x
	tangente.point.y = y
	tangente.point.tex = `P\\left(${x.tex};${y.tex}\\right)`
	tangente.derivee = P.clone().derivative()
	tangente.pente = tangente.derivee.evaluate(x)
	tangente.ordonnee = y.clone().subtract(x.clone().multiply(tangente.pente))
	tangente.equation = "y=" + (new Polynom(new Monom(tangente.pente).multiply(new Monom("x")), new Monom(tangente.ordonnee))).tex
}

function makeRandom() {

	let P = Random.polynom({
		degree: Random.number(2, 3),
		fraction: false,
		unit: false,
		allowNullMonom: true
	})

	fx.value = P.display
	abscisse.value = Random.number(-10, 10)

	calculerLaTangente()
}

calculerLaTangente()
</script>

<style scoped>

</style>
