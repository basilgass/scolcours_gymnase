<!--
Affichage d'une division euclidienne
Uniquement utilisée dans Posts/Illustrations/Elements/IllustrationEuclidian
-->
<template>
	<div class="pi-euclidian-wrapper">
		<div
			v-if="result"
			v-bind="$attrs"
			class="mt-10 space-y-10"
		>
			<div v-if="!atBottom">
				<div
					v-if="asymptote"
					v-katex.display.left="`${fxname}\\frac{ ${result.numerator.tex} }{ ${result.denominator.tex} } = ${result.euclidian.quotient.tex} + \\frac{ ${result.euclidian.reminder.tex} }{ ${result.denominator.tex} }`"
				/>
				<div
					v-if="fundamental"
					v-katex.display.left="`${result.numerator.tex} = \\left(${result.denominator.tex}\\right) \\cdot \\left(${result.euclidian.quotient.tex}\\right) + \\left(${result.euclidian.reminder.tex}\\right)`"
				/>
			</div>

			<table class="border-collapse">
				<tr
					v-for="(step, index) of result.table.steps"
					:key="'step'+index"
				>
					<td
						v-for="(item, index2) of step[0]"
						:key="'stepItem'+index2"
						v-katex.display.dense="item"
						:class="{
							'katex-left': item.includes('\\big)'),
							'katex-right': !item.includes('\\big)'),
							'border-b border-black': index%2===1 && index2>=result.table.underline[(index-1)/2].start && index2<=result.table.underline[(index-1)/2].stop
						}"
					/>
					<td
						v-for="(item, index2) of step[1]"
						:key="'stepItem'+index2"
						v-katex.display.dense="item"
						:class="{
							'border-l border-black pl-2': index2===0,
							'border-b border-black': index===0
						}"
					/>
				</tr>
			</table>

			<div v-if="atBottom">
				<div
					v-if="asymptote"
					v-katex.display.left="`${fxname}\\frac{ ${result.numerator.tex} }{ ${result.denominator.tex} } = ${result.euclidian.quotient.tex} + \\frac{ ${result.euclidian.reminder.tex} }{ ${result.denominator.tex} }`"
				/>
				<div
					v-if="fundamental"
					v-katex.display.left="`${result.numerator.tex} = \\left(${result.denominator.tex}\\right) \\cdot \\left(${result.euclidian.quotient.tex}\\right) + \\left(${result.euclidian.reminder.tex}\\right)`"
				/>
			</div>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</div>
</template>
<script setup>

import {computed} from "vue"
import {PiMath} from "pimath/esm"

let props = defineProps({
	fx: {type: String, default: null},
	name: {type: String, default: "f(x)"},
	fundamental: {type: Boolean, default: false},
	asymptote: {type: Boolean, default: false},
	atBottom: {type: Boolean, default: false}
})

let emits = defineEmits(["update"])

function addStep(P, degree, withParenthesis, isFirstStep) {
	withParenthesis = withParenthesis === undefined ? false : withParenthesis

	let step = [], cntMonom = 0

	for (let i = degree; i >= 0; i--) {
		let M = P.monomByDegree(i)

		if (M.isZero()) {
			if(isFirstStep) {
				let litteral = i === 0 ? "" : "x"
				litteral = litteral + (i > 1 ? `^{${i}}`: "")
				step.push(`\\textcolor{lightgrey}{+0${litteral}}`)
			}else{
				step.push("")
			}
		} else {
			if (i < degree && M.coefficient.isStrictlyPositive() && cntMonom>0) {
				step.push("+" + M.tex)
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
				if (step[i] !== "" && inside === false) {
					step.splice(i, 0, "-\\big(")
					break
				}
			}

			inside = false
			for (let i = step.length - 1; i >= 0; i--) {
				if (step[i] !== "" && inside === false) {
					step.splice(i + 1, 0, "\\big)")
					break
				}
			}
		}else {
			step.unshift("")
			step.push("")
		}
	}
	return step
}

let result = computed(() => {
		try {
			let N = new PiMath.Polynom(numerator.value),
				D = new PiMath.Polynom(denominator.value),
				euclidian = N.euclidian(D)

			// For the euclidian division display.
			let steps = [],
				degree = N.degree().value,
				crtPolynom = N.clone(),
				zeroPolynom = new PiMath.Polynom().zero(),
				maxDegreeRight = Math.max(D.degree().value, euclidian.quotient.degree().value),
				underline = []

			// Première ligne
			steps.push([
				[...addStep(crtPolynom, degree,false, true)],
				[D.tex]
			// [...addStep(D, maxDegreeRight)]
			])

			for (let m of euclidian.quotient.monoms) {
				let DM = D.clone().multiply(m)

				steps.push([
					[...addStep(DM, degree, true)],
					[steps.length === 1 ? euclidian.quotient.tex : ""]
				// [...addStep(steps.length === 1 ? euclidian.quotient : zeroPolynom, maxDegreeRight)]
				])

				// Create the underline.
				let start, stop
				for(let i = 0; i<steps[steps.length-1][0].length;i++){
					if (steps[steps.length - 1][0][i] === "-\\big(") {
						start = +i + 1
					} else if (steps[steps.length - 1][0][i] === "\\big)") {
						stop = +i - 1
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
					[""]
				// [...addStep(zeroPolynom, maxDegreeRight)]
				])
			}

			emits("update", {
				P: N.reorder().tex,
				Q: D.reorder().tex,
				R: crtPolynom.reorder().tex
			})
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
			// console.error(e)
			// emits("update", {
			// 	P: numerator.value,
			// 	Q: denominator.value,
			// 	R: ""
			// })
			return false
		}
	}),
	numerator = computed(()=>{
		return props.fx.split("/")[0]
	}),
	denominator = computed(()=>{
		return props.fx.split("/")[1]||"1"
	}),
	fxname = computed(()=>{
		return props.name?`${props.name}=`:""
	})
</script>
