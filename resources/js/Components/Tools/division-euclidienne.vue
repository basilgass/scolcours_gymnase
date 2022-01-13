<template>
	<Panel>
		<form-input
			v-model="numerator"
			label="numérateur"
			name="numerator"
		/>

		<form-input
			v-model="denominator"
			label="dénominateur"
			name="denominator"
		/>
		<div v-if="result">
			<div v-katex.display.left="`\\frac{ ${result.numerator.tex} }{ ${result.denominator.tex} } = ${result.euclidian.quotient.tex} + \\frac{ ${result.euclidian.reminder.tex} }{ ${result.denominator.tex} }`" />
			<div v-katex.display.left="`${result.numerator.tex} = \\left(${result.denominator.tex}\\right) \\cdot \\left(${result.euclidian.quotient.tex}\\right) + \\left(${result.euclidian.reminder.tex}\\right)`" />
			
			<table>
				<tr
					v-for="(step, index) of result.steps"
					:key="'step'+index"
				>
					<td
						v-for="(item, index2) of step"
						:key="'stepItem'+index2"
						v-katex.display.left="item"
						class="w-[60px]"
					/>
				</tr>
			</table>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>

<script setup>
/** Tools
 * title: division de polynômes
 * body: division euclidienne avec des polynômes
 * parameters: numerator=Polynom, denominator=Polynom
 * tags: algebre,1M
 */
import Panel from '@/Components/Ui/Panel'
import FormInput from '@/Components/Form/FormInput'
import { computed, ref } from 'vue'
import { Polynom } from 'pimath/esm/maths/algebra'

let numerator = ref('3x^2+5x-4'),
	denominator = ref('x-5')

function addStep(P, degree){
	let step = []
	for(let i = degree; i>=0; i--){
		let M = P.monomByDegree(i)
		
		if(M.isZero()){
			step.push('')
		}else {
			if (i < degree && M.coefficient.isStrictlyPositive()) {
				step.push('+' + M.tex)
			} else {
				step.push(M.tex)
			}
		}
	}
	return step
}
let result = computed(()=>{
	try{
		let N = new Polynom(numerator.value),
			D = new Polynom(denominator.value),
			euclidian = N.euclidian(D),
			steps = [],
			degree = N.degree().value,
			crtPolynom = N.clone(),
			zeroPolynom = new Polynom().zero(),
			maxDegreeRight = Math.max(D.degree().value, euclidian.quotient.degree().value)
		
		// Première ligne
		steps.push(['', ...addStep(crtPolynom, degree), '', ...addStep(D, maxDegreeRight)])
		
		for(let m of euclidian.quotient.monoms){
			let DM = D.clone().multiply(m)
			if(steps.length===1) {
				steps.push(['-\\big(',...addStep(DM, degree), '\\big)', ...addStep(euclidian.quotient, maxDegreeRight)])
			}else{
				steps.push(['-\\big(', ...addStep(DM, degree), '\\big)', ...addStep(zeroPolynom, maxDegreeRight)])
			}
			crtPolynom.subtract(DM)
			steps.push(['',...addStep(crtPolynom, degree), '', ...addStep(zeroPolynom, maxDegreeRight)])
		}
		//TODO:  Make the display array of euclidian fraction -> should be put in PiMath
		
		return {
			numerator: N,
			denominator: D,
			euclidian,
			steps
		}
		
	}catch (e) {
		console.error(e)
		return false
	}
})
</script>
