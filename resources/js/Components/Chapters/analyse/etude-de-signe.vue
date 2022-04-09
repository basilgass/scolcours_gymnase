<template>
	<section ref="root">
		<table-of-contents
			query=".chapter-menu"
			class="space-y-10 katex-boxed"
		>
			<!-- User input -->
			<div>
				<form-input
					v-model="fx"
					name="fx"
					label="fonction rationnelle"
				/>
				<div class="text-sm">
					Entrer la fonction en utilisant <code>/</code> pour la division. Il n'est pas nécessaire d'englober le numérateur ou le dénominateur dans des parenthèses supplémentaires.
				</div>
				<div v-katex="fxTex" />
			</div>

			<!-- Ensemble de définition -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Ensemble de définition
				</h2>
				<div
					v-if="zeroes.length===0"
					v-katex="`ED_f=\\mathbb{R}`"
				/>
				<div
					v-else
					v-katex="`ED_f=${domain}`"
				/>
			</div>

			<!-- Tableau de signes -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Tableau de signes
				</h2>
				<pre v-text="tos.tex" />
			</div>

			<!-- Asymptotes verticales et horizontales -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Asymptotes verticales et horizontales
				</h2>

				<div v-if="limits.length>0">
					<div
						v-for="(item, index) of limits"
						:key="`limits-${index}`"
						v-katex="item"
					/>
				</div>
			</div>

			<!-- Asymptotes obliques -->
			<div v-if="aUneAsymptoteOblique">
				<h2 class="chapter-menu text-lg mb-10">
					Asymptotes obliques
				</h2>
				<div v-katex="`\\delta(x) = ${positionRelative.tex}\\implies \\text{AO: } y = ${positionRelative.quotient.tex}`" />
			</div>

			<!-- dérivée et tableau de variation -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Variation
				</h2>
				<div v-katex="`f'(x)=${derivative.tex}=${derivative.texFactors}`" />
			</div>

			<!-- Graphe -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Représentation graphique
				</h2>
			</div>
		</table-of-contents>
	</section>
</template>

<script setup>
/** Chapter
 * title: étude de signe
 * body: étude de signe d'une fonction rationnelle.
 */
import {ref, watch} from "vue"
import FormInput from "@/Components/Form/FormInput"
import TableOfContents from "@/Components/Ui/TableOfContents"
import {PiMath} from "pimath/esm"

let root = ref(null),
	fx = ref("(3x-4)(2x+5)/(x-4)(x+4)"),
	fxTex = ref(""),
	zeroes = ref([]),
	limits = ref([]),
	domain = ref(""),
	aUneAsymptoteOblique = ref(false),
	positionRelative = ref({}),
	derivative = ref("f'(x)="),
	tos = ref("")

function etude() {
	let fxRational = fx.value.split("/"),
		numerator = new PiMath.Polynom(fxRational[0]),
		denominator = new PiMath.Polynom(fxRational.length>=2?fxRational[1]:1),
		fonctionRationnelle = new PiMath.Rational(
			numerator, denominator
		)

	domain.value = fonctionRationnelle.domain()

	fxTex.value = `f(x) = ${fonctionRationnelle.tex} = ${fonctionRationnelle.texFactors}`

	tos.value = fonctionRationnelle.makeTableOfSigns()

	// Zéros du dénominateur.
	zeroes.value = denominator.getZeroes()
	limits.value = []
	if(zeroes.value.length>0){
		zeroes.value.forEach(z => {
			let L

			L = fonctionRationnelle.limits(z, "above")
			limits.value.push(
				`\\displaystyle \\lim_{x \\underset{>}{\\to} ${z.tex} }\\ f(x) = ${L.tex} \\implies ${L.isInfinity()?"\\text{AV: }x="+z.tex:"\\text{Trou: }("+z.tex+";"+L.tex+")"}`
			)

			L = fonctionRationnelle.limits(z, "below")
			limits.value.push(
				`\\displaystyle \\lim_{x\\underset{<}{\\to} ${z.tex} }\\ f(x) = ${L.tex} \\implies ${L.isInfinity()?"\\text{AV: }x="+z.tex:"\\text{Trou: }("+z.tex+";"+L.tex+")"}`
			)

		})
	}

	if(fonctionRationnelle.numerator.degree().subtract(fonctionRationnelle.denominator.degree()).isOne()){
		aUneAsymptoteOblique.value = true
		let {quotient, reminder} = fonctionRationnelle.numerator.clone().euclidian(fonctionRationnelle.denominator)
		positionRelative.value = {
			quotient, reminder,
			tex: `${quotient.tex} + \\frac{ ${reminder.tex} }{ ${fonctionRationnelle.denominator.tex} }`

		}
	}else{
		aUneAsymptoteOblique.value = false
	}

	derivative.value = fonctionRationnelle.derivative()
}

watch(fx, ()=>etude())
etude()
</script>
