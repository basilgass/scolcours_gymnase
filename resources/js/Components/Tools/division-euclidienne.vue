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
		<div
			v-if="result"
			class="mt-10 space-y-10"
		>
			<div
				v-katex.display.left="`\\frac{ ${result.numerator.tex} }{ ${result.denominator.tex} } = ${result.euclidian.quotient.tex} + \\frac{ ${result.euclidian.reminder.tex} }{ ${result.denominator.tex} }`"
			/>
			<div
				v-katex.display.left="`${result.numerator.tex} = \\left(${result.denominator.tex}\\right) \\cdot \\left(${result.euclidian.quotient.tex}\\right) + \\left(${result.euclidian.reminder.tex}\\right)`"
			/>
			
			<table class="border-collapse">
				<tr
					v-for="(step, index) of result.table.steps"
					:key="'step'+index"
				>
					<td
						v-for="(item, index2) of step[0]"
						:key="'stepItem'+index2"
						v-katex.display="item"
						class="w-[60px]"
						:class="{
							'katex-right': item.includes('\\big('),
							'katex-left': !item.includes('\\big('),
							'border-b border-black': index%2===1 && index2>=result.table.underline[(index-1)/2].start && index2<=result.table.underline[(index-1)/2].stop
						}"
					/>
					<td
						v-for="(item, index2) of step[1]"
						:key="'stepItem'+index2"
						v-katex.display.left="item"
						class="w-[60px]"
						:class="{
							'border-l border-black': index2===0,
							'border-b border-black': index===0
						}"
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

// TODO: Rework the euclidian division output as table - it's complicated :)
// TODO:  Make the display array of euclidian fraction as tex -> should be put in PiMath

let numerator = ref('3x^2+5x-4'),
	denominator = ref('x-5')

function addStep (P, degree, withParenthesis) {
	withParenthesis = withParenthesis === undefined ? false : withParenthesis
	
	let step = [], cntMonom = 0
	
	for (let i = degree; i >= 0; i--) {
		let M = P.monomByDegree(i)
		
		if (M.isZero()) {
			step.push('')
		} else {
			if (i < degree && M.coefficient.isStrictlyPositive() && cntMonom>0) {
				step.push('+' + M.tex)
			} else {
				step.push(M.tex)
			}
			cntMonom++
		}
	}
	
	if(withParenthesis!==undefined) {
		if (withParenthesis) {
			let inside = false
			for (let i = 0; i < step.length; i++) {
				if (step[i] !== '' && inside === false) {
					step.splice(i, 0, '-\\big(')
					break
				}
			}
			
			inside = false
			for (let i = step.length - 1; i >= 0; i--) {
				if (step[i] !== '' && inside === false) {
					step.splice(i + 1, 0, '\\big)')
					break
				}
			}
		}else{
			step.unshift('')
			step.push('')
		}
	}
	return step
}

let result = computed(() => {
	try {
		let N = new Polynom(numerator.value),
			D = new Polynom(denominator.value),
			euclidian = N.euclidian(D)
		
		// For the euclidian division display.
		let steps = [],
			degree = N.degree().value,
			crtPolynom = N.clone(),
			zeroPolynom = new Polynom().zero(),
			maxDegreeRight = Math.max(D.degree().value, euclidian.quotient.degree().value),
			underline = []
		
		// Première ligne
		steps.push([
			[...addStep(crtPolynom, degree,false)],
			[...addStep(D, maxDegreeRight)]
		])
		
		for (let m of euclidian.quotient.monoms) {
			let DM = D.clone().multiply(m)
			
			steps.push([
				[...addStep(DM, degree, true)],
				[...addStep(steps.length === 1 ? euclidian.quotient : zeroPolynom, maxDegreeRight)]
			])
			
			// Create the underline.
			let start, stop
			for(let i = 0; i<steps[steps.length-1][0].length;i++){
				if(steps[steps.length-1][0][i]==='-\\big('){
					start = +i+1
				}else if(steps[steps.length-1][0][i]==='\\big)'){
					stop = +i-1
					break
				}
			}
			underline.push({
				start,
				stop
			})
			
			crtPolynom.subtract(DM)
			steps.push([
				[...addStep(crtPolynom, degree,false)],
				[...addStep(zeroPolynom, maxDegreeRight)]
			])
		}
		
		return {
			numerator: N,
			denominator: D,
			euclidian,
			table: {
				steps,
				underline
			}
		}
		
	} catch (e) {
		console.error(e)
		return false
	}
})
</script>
