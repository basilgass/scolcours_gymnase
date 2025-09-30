<script setup lang="ts">
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {Factor, PolyFactor, Polynom, Random} from "pimath"
import {computed} from "vue"
import TexCode from "@/Components/Ui/TexCode.vue"

defineOptions({layout: LayoutMain})

// function simpleFractions(polyfactor: PolyFactor): PolyFactor[] {
// 	// The numerator is a constant
// 	const numerator_degree = polyfactor.numerator.degree().value
// 	const denominator_degree = polyfactor.denominator.degree().value
//
// 	const numerator_polynom = polyfactor.numerator.develop().factors[0].polynom
// 	if (denominator_degree <= 1) {
// 		throw new Error('The polyfactor cannot be transformed to simple fractions.')
// 	}
//
// 	if (denominator_degree <= numerator_degree) {
// 		throw new Error('Use polynomial division to simplify the fraction.')
// 	}
//
// 	// Make sure the polynomial is factorized
// 	const factorized = polyfactor.factorize()
//
// 	// Convert each x^n polnyom to a polyfoactor with a polynom of x and a power of n
// 	const factorizedDenominator = factorized.denominator
// 	factorizedDenominator.factors.forEach(factor => {
// 		if (factor.polynom.monoms.length === 1 && factor.polynom.degree('x').value > 0) {
// 			factor.power = factor.polynom.degree('x')
// 			factor.polynom = new Polynom(factor.variables[0])
// 		}
// 	})
//
// 	// The denominator is a product of linear factors
// 	if (factorizedDenominator.factors.some(f => f.polynom.monoms.length > 1 && f.polynom.degree().value > 1)) {
// 		throw new Error('The denominator is not a product of linear factors.')
// 	}
//
// 	const fractions: PolyFactor[] = []
// 	const amplification: Polynom[] = []
//
// 	const alphabet = 'abcdefghijklmnopqrstuvwyz'.split('') // avoid the 'x' letter
//
// 	factorizedDenominator.factors.forEach(factor => {
// 		const polynom = factor.polynom
// 		const degree = factor.degree().value
//
// 		for (let i = 1; i <= degree; i++) {
// 			fractions.push(
// 				new PolyFactor(
// 					new Factor(alphabet.shift()),
// 					new Factor(polynom, -i)
// 				)
// 			)
// 			amplification.push(
// 				factorizedDenominator.clone()
// 					.divide(new PolyFactor(new Factor(polynom, i))).reduce()
// 					.develop().factors[0].polynom
// 			)
// 		}
// 	})
//
// 	// Get the polynom using the amplifications.
// 	const abc_polynom = new Polynom(0)
// 	fractions.forEach((fraction, index) => {
// 		abc_polynom.add(
// 			amplification[index].multiply(fraction.numerator.factors[0].polynom)
// 		)
// 	})
// 	const abc_degree = abc_polynom.degree('x').value
//
// 	const equations: Equation[] = []
//
// 	for (let degree = abc_degree; degree >= 0; degree--) {
// 		equations.push(new Equation(
// 				new Polynom(
// 					...abc_polynom
// 						.monomsByDegree(degree, 'x')
// 						.map(monom => {
// 							monom.literal['x'] = new Fraction(0)
// 							return monom
// 						})
// 				),
// 				new Polynom(
// 					...numerator_polynom
// 						.monomsByDegree(degree, 'x')
// 				)
// 			)
// 		)
// 	}
//
// 	// Solve the system of equations
// 	const linear = new LinearSystem(...equations)
// 	// linear.equations.forEach(equ => console.log(equ.display))
// 	const matrix = linear.solveMatrix()
//
// 	return fractions.map((fraction, index) => {
// 		const factor = fraction.numerator.clone()
//
// 		fraction.divide(factor)
// 			.multiply(new PolyFactor(
// 				new Factor(matrix[index]))
// 			).reduce()
//
// 		return fraction
// 	})
// }

function generateFractionSimple() {
	const max_number_of_factors = 2
	const unit_polynom = true
	const max_degree_of_polynom = 1
	const max_power_of_factor = 2
	const max_global_power = 3
	// const allow_x_monom = true


	const numeratorFactors: Factor[] = []
	const denominatorFactors: Factor[] = []
	const simple_fractions: PolyFactor[] = []

	let current_degree = 0
	const common_denominator: Factor[] = []
	for (let i = 0; i < max_number_of_factors; i++) {

		const remaining_degrees = max_global_power - current_degree

		if (remaining_degrees <= 0) {
			break
		}

		const polynom = Random.polynom({
			degree: Math.min(remaining_degrees, max_degree_of_polynom),
			allowNullMonom: false,
			unit: unit_polynom
		})

		const polynom_degree = polynom.degree().value

		const power = Random.number(1, Math.min(Math.floor(remaining_degrees / polynom_degree), max_power_of_factor))

		common_denominator.push(new Factor(polynom, power))


		for (let i = 1; i <= power; i++) {
			const num = new Factor(Random.polynom({
				degree: polynom_degree - 1,
				allowNullMonom: false,
				unit: false
			}))
			const den = new Factor(polynom, i)

			numeratorFactors.push(num)
			denominatorFactors.push(den)

			simple_fractions.push(
				new PolyFactor(num).divide(new PolyFactor(den))
			)
		}

		current_degree += polynom_degree * power
	}

	const common_polyfactor = new PolyFactor(...common_denominator)
	const numerator_polynom: Polynom = new Polynom(0)

	simple_fractions.forEach(fraction => {
		const num = fraction.numerator.factors[0].polynom
		const amplify_factor = common_polyfactor.clone().divide(fraction.denominator).reduce().develop().factors[0].polynom

		numerator_polynom.add(
			amplify_factor.multiply(num)
		)
	})

	numerator_polynom.reduce()
	const result_polyfactor: PolyFactor = new PolyFactor().fromPolynom(numerator_polynom).divide(common_polyfactor)

	return {
		question: result_polyfactor,
		answer: simple_fractions,
		tex: {
			question: result_polyfactor.asRoot.tex,
			answer: simple_fractions.map(x => x.asRoot.tex).join(' + ')
		}
	}
}


let result = computed(() => {
	try {

		const result = generateFractionSimple()

		return {
			tex: result.tex.question + ' = ' + result.tex.answer
		}
	} catch (e) {

		console.error(e)
		return {
			tex: '\\text{ le polynôme n\'est pas reconnu.}'
		}
	}
})

generateFractionSimple()

</script>

<template>
	<article class="scolcours-container">
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
