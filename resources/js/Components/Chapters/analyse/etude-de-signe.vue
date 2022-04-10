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
					@keyup.enter="etude"
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

				<table
					v-if="tos"
					class="border-r tos border-gray-400 mx-auto"
				>
					<thead>
						<tr>
							<th class="border-r border-gray-400" />
							<th>
								<div class="flex flex-row items-center">
									<div
										v-katex.inline="`-\\infty`"
										class="w-6 text-xs pl-1"
									/>
									<div
										v-for="n in tos.zeroes.length"
										:key="`tos-zeroes-${n}`"
										v-katex.inline="tos.zeroes[n-1].tex"
										class="w-24 text-center hover:bg-white py-2"
									/>
									<div
										v-katex.inline="`+\\infty`"
										class="w-6 text-xs mr-1"
									/>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(factor, index) of tos.factors"
							:key="`tos-${index}`"
							class="border-t first:border-gray-400"
						>
							<td
								v-katex.inline="factor.tex"
								class="min-w-[100px] border-r text-center border-gray-400"
							/>
							<td>
								<div class="flex flex-row">
									<div
										v-for="n in (tosSigns(index).length)"
										:key="`tos-${index}-cell-${n}`"
										v-katex.inline="n%2===1?tosSigns(index)[n-1]:(tosSigns(index)[n-1]==='z'?0:'')"
										:class="{
											'cell-v-line-d':tosSigns(index)[n-1]==='d',
											'cell-v-line': n%2===0
										}"
										class="w-12 text-center hover:bg-white py-2"
									/>
								</div>
							</td>
						</tr>
					</tbody>
					<tfoot class="border-t border-t-2 border-gray-400">
						<td
							v-katex.inline="'f(x)'"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row">
								<div
									v-for="n in (tosSigns(tos.signs.length-1).length)"
									:key="`tos-foot-cell-${n}`"
									v-katex.inline="n%2===1?tosSigns(tos.signs.length-1)[n-1]:(tosSigns(tos.signs.length-1)[n-1]==='z'?0:'')"
									:class="{
										'cell-v-line-d':tosSigns(tos.signs.length-1)[n-1]==='d',
										'cell-v-line': n%2===0
									}"
									class="w-12 text-center hover:bg-white py-2"
								/>
							</div>
						</td>
					</tfoot>
				</table>

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
				<div
					v-katex="`\\delta(x) = ${positionRelative.tex}\\implies \\text{AO: } y = ${positionRelative.quotient.tex}`"
				/>
			</div>

			<!-- dérivée et tableau de variation -->
			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Variation
				</h2>
				<div v-katex="derivativeTex" />
			</div>

			<div>
				<h2 class="chapter-menu text-lg mb-10">
					Tableau de variation
				</h2>

				<table
					v-if="tosdx"
					class="border-r tos border-gray-400 mx-auto"
				>
					<thead>
						<tr>
							<th class="border-r border-gray-400" />
							<th>
								<div class="flex flex-row items-center">
									<div
										v-katex.inline="`-\\infty`"
										class="w-6 text-xs pl-1"
									/>
									<div
										v-for="n in tosdx.zeroes.length"
										:key="`tosdx-zeroes-${n}`"
										v-katex.inline="tosdx.zeroes[n-1].tex"
										class="w-24 text-center hover:bg-white py-2"
									/>
									<div
										v-katex.inline="`+\\infty`"
										class="w-6 text-xs mr-1"
									/>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(factor, index) of tosdx.factors"
							:key="`tos-${index}`"
							class="border-t first:border-gray-400"
						>
							<td
								v-katex.inline="factor.tex"
								class="min-w-[100px] px-3 border-r text-center border-gray-400"
							/>
							<td>
								<div class="flex flex-row">
									<div
										v-for="n in (tosdxSigns(index).length)"
										:key="`tosdx-${index}-cell-${n}`"
										v-katex.inline="n%2===1?tosdxSigns(index)[n-1]:(tosdxSigns(index)[n-1]==='z'?0:'')"
										:class="{
											'cell-v-line-d':tosdxSigns(index)[n-1]==='d',
											'cell-v-line': n%2===0
										}"
										class="w-12 text-center hover:bg-white py-2"
									/>
								</div>
							</td>
						</tr>
					</tbody>
					<tfoot class="border-t border-t-2 border-gray-400">
						<td
							v-katex.inline="'f(x)'"
							class="min-w-[100px] border-r text-center border-gray-400"
						/>
						<td>
							<div class="flex flex-row">
								<div
									v-for="n in (tosdxSigns(tosdx.signs.length-1).length)"
									:key="`tosdx-foot-cell-${n}`"
									v-katex.inline="n%2===1?tosdxSigns(tosdx.signs.length-1)[n-1]:(tosdxSigns(tosdx.signs.length-1)[n-1]==='z'?0:'')"
									:class="{
										'cell-v-line-d':tosdxSigns(tosdx.signs.length-1)[n-1]==='d',
										'cell-v-line': n%2===0
									}"
									class="w-12 text-center hover:bg-white py-2"
								/>
							</div>
						</td>
					</tfoot>
				</table>

				<pre v-text="tosdx.tex" />
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
import {computed, ref} from "vue"
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
	derivativeTex = ref("f'(x)="),
	tos = ref({}),
	tosdx = ref({})


let tosSigns = computed(() => {
	return (index) => {
		let signs = [...tos.value.signs[index]]
		signs.shift()
		signs.pop()
		return signs
	}
})

let tosdxSigns = computed(() => {
	return (index) => {
		let signs = [...tosdx.value.signs[index]]
		signs.shift()
		signs.pop()
		return signs
	}
})


function etude() {
	let fxRational = fx.value.split("/"),
		numerator,
		denominator,
		fonctionRationnelle,
		fonctionRationnelleDx

	try {
		numerator = new PiMath.Polynom(fxRational[0])
		denominator = new PiMath.Polynom(fxRational.length >= 2 ? fxRational[1] : 1)
	} catch (e) {
		return
	}

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
	} else {
		aUneAsymptoteOblique.value = false
	}


	fonctionRationnelleDx = fonctionRationnelle.derivative()
	tosdx.value = fonctionRationnelleDx.makeTableOfSigns()

	derivativeTex.value = `f(x) = ${fonctionRationnelleDx.tex} = ${fonctionRationnelleDx.texFactors}`
}

etude()
</script>
