<script setup lang="ts">
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Equation, Factor, Fraction, LinearSystem, Monom, PolyFactor, Polynom, Random} from "pimath"
/** Tools
 * title: fractions simples
 * body: décomposition d'une fraction rationnelle en fractions simples
 * parameters: polynomes
 * tags: algebre,3M
 */
import {computed, ref} from "vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "numérateur",
		type: "text",
		value: ref("3"),
		fromUrl: "num"
	},
	{
		label: "dénominateur",
		type: "text",
		value: ref("(x-2)^2(x+3)"),
		fromUrl: "den"
	}

])

const numerator = computed(() => forms[0].value.value as string)
const denominator = computed(() => forms[1].value.value as string)

function simpleFractions(polyfactor: PolyFactor): PolyFactor[] {
	let numerator: Polynom = polyfactor.numerator.develop().factors[0].polynom
	const denominator: Polynom = polyfactor.denominator.develop().factors[0].polynom

	const fractions: PolyFactor[] = []

	if (numerator.degree().isGeq(denominator.degree())) {
		const {quotient, reminder} = numerator.euclidean(denominator)

		fractions.push(new PolyFactor().fromPolynom(quotient))

		numerator = reminder
	}

	// The degree of the numerator is less than the degree of the denominator
	// Check if the denominator can be factorized
	const factorizedDenominator = new PolyFactor().fromPolynom(denominator).factorize()
	if (factorizedDenominator.factors.length === 1 && factorizedDenominator.factors[0].power.isOne()) {
		const factor = factorizedDenominator.factors[0]

		fractions.push(
			new PolyFactor().fromPolynom(numerator)
				.divide(new PolyFactor(factor))
				.reduce()
		)

		return fractions
	}

	// The denominator is a product of factors
	const numerator_polynom = new Polynom().zero()
	const letters = 'abcdefghijklmnopqrstuvwyz'
	const variables = letters.split('')

	const denominator_factors: Factor[] = []
	const numerator_polynoms: Polynom[] = []

	factorizedDenominator.factors.forEach(factor => {
		const factor_power = factor.power.value
		const factor_degree = factor.polynom.degree().value

		for (let power = 1; power <=factor_power; power++) {
			const factor_at_defined_power = factor.clone()
			factor_at_defined_power.power = power

			denominator_factors.push(factor_at_defined_power)

			const polynom = new Polynom().zero()

			for (let degree = factor_degree - 1; degree >= 0; degree--) {
				if (degree === 0) {
					polynom.add(new Monom(`${variables.shift()}`))
				} else if (degree === 1) {
					polynom.add(new Monom(`${variables.shift()}x`))
				} else {
					polynom.add(new Monom(`${variables.shift()}x^(${degree})`))
				}
			}

			const amplify_by = factorizedDenominator.clone()
				.divide(new PolyFactor(factor_at_defined_power))
				.reduce().develop()
				.factors[0].polynom

			numerator_polynoms.push(polynom.clone())

			numerator_polynom.add(
				polynom
					.multiply(amplify_by)
					.reduce()
			)
		}
	})

	const max_degree = Math.max(numerator.degree('x').value, numerator_polynom.degree('x').value)
	const equations: Equation[] = []
	for (let degree = max_degree; degree >= 0; degree--) {
		const left_polynom = new Polynom(
			...numerator_polynom
				.monomsByDegree(degree, 'x')
				.map(monom => {
					monom.literal['x'] = new Fraction(0)
					return monom
				}))
		const right_polynom = new Polynom(
			...numerator
				.monomsByDegree(degree, 'x')
				.map(monom => {
					monom.literal['x'] = new Fraction(0)
					return monom
				})
		)

		equations.push(new Equation(left_polynom, right_polynom))
	}

	const linear = new LinearSystem(...equations)

	const solutions = linear.solveMatrix()
	solutions.forEach((value, index)=>{
		const letter = letters[index]

		// Replace in all numerator_polynom the letter by the value.
		numerator_polynoms.forEach(polynom=>{
			polynom.replaceBy(letter, new Polynom(value)).reduce()
		})
	})

	// Make the solutions
	for(let i=0; i<numerator_polynoms.length; i++){
		fractions.push(
			new PolyFactor().fromPolynom(numerator_polynoms[i]).divide(new PolyFactor(denominator_factors[i])).reduce()
		)
	}

	return fractions
}

function generate(){
	const p1 = Random.polynom({
		degree: 1, unit: true, fraction: false
	})

	const p2 =Random.polynom({
		degree: 1, unit: true, fraction: false
	})

	const rnd = Random.number(0,2)
	if(rnd===1){
		p1.pow(2)
	}
	if(rnd===2){
		p2.pow(2)
	}

	forms[1].value.value = p1.clone().multiply(p2).reduce().display

	forms[0].value.value = Random.numberSym(10, false).toString()


}

let result = computed(() => {
	try {
		const P = new PolyFactor().fromPolynom(numerator.value, denominator.value)

		const simple_fractions = simpleFractions(P)

		return {
			tex: P.asRoot.tex + ' = ' + simple_fractions.map(x => x.asRoot.tex).join('+')
		}
	} catch (e) {

		console.error(e)
		return {
			tex: '\\text{ le polynôme n\'est pas reconnu.}'
		}
	}
})

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<button @click="generate">
			générer
		</button>
		<div v-if="result">
			<div v-katex.display.boxed.lg="`${result.tex}`" />

			<tex-code :tex="result.tex" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>
