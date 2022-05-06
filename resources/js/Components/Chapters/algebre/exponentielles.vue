<template>
	<table-of-contents
		ref="toc"
		query=".chapter-menu"
		class="space-y-10"
	>
		<chapter-article>
			<template #title>
				Equations exponentielles
			</template>

			<chapter-exercise-steps :content="example1" />
			<chapter-exercise-steps :content="example2" />

			<what-to-know
				class="max-w-xl mt-3 mb-10"
				:questions="generateQuestions"
				sep=""
				pre-answer-sep=" \implies "
			>
				Résoudre les équations exponentielles suivantes. Réponse sous forme exacte.
			</what-to-know>
		</chapter-article>

		<chapter-article>
			<template #title>
				Equations logarithmiques
			</template>

			<div>Il s'agit de résoudre des équations du type \(\log(x-3)=5\)</div>
		</chapter-article>
	</table-of-contents>
</template>

<script setup>
/** Chapter
 * title: exponentielles
 * body: L'étude des fonctions et équations exponentielles
 */
import TableOfContents from "@/Components/Ui/TableOfContents"
import ChapterArticle from "@/Components/Ui/ChapterArticle"
import {PiMath} from "pimath/esm"
import ChapterExerciseSteps from "@/Components/Ui/ChapterExerciseSteps"
import WhatToKnow from "@/Components/Ui/WhatToKnow"

function example1() {
	let base = PiMath.Random.number(2, 9),
		value = PiMath.Random.number(2, 20)

	return {
		header: `Résoudre l'équation \\[${base}^x=${value}\\]`,
		steps: [
			{
				id: 1,
				text: `La radical sour la puissance \\(x\\) vaut \\(${base}\\). On applique donc la fonction logarithme en base \\(${base}\\) sur les deux membres de l'équation`,
				math: `\\log_{\\textcolor{red}{ ${base} }}(\\textcolor{red}{ ${base} }^x) = \\log_${base}(${value})`
			},
			{
				id: 2,
				text: `Le logarithme en base \\(${base}\\) de \\(${base}^x\\) vaut la puissance, donc \\(x\\). On peut donc simplifier le membre de gauche`,
				math: `x = \\log_${base}(${value})`
			},
			{
				id: 3,
				text: "On utilise la formule \\(\\log_n(a) = \\dfrac{\\ln(a)}{\\ln(n)}\\) qui permet d'utiliser une calculette",
				math: `x = \\frac{\\ln(${value})}{\\ln(${base})} \\approx ${(Math.log(value) / Math.log(base)).toFixed(3)}`
			}
		]
	}

}

function example2() {
	let base = PiMath.Random.number(2, 9),
		power = PiMath.Random.number(2, 3),
		bp = base ** power,
		value = PiMath.Random.number(2, 20),
		polynom = PiMath.Random.polynom({
			degree: 1
		}),
		polynomForAnswer = polynom.clone()

	let data = {
		header: `Résoudre l'équation \\[${bp}\\cdot${base}^{ ${polynom.tex} } = ${value}\\]`,
		steps: [
			{
				id: 1,
				text: `Le premier facteur \\(${bp}\\) est une puissance de \\(${base}\\).`,
				math: `${base}^{ ${power} }\\cdot${base}^{ ${polynom.tex} } = ${value}`
			},
			{
				id: 2,
				text: "Les deux facteurs du membre de gauche ont le même radical. On peut additionner les puissances.",
				math: `${base}^{ ${polynom.add(power).tex} } = ${value}`
			},
			{
				id: 3,
				text: `La radical sour la puissance \\(x\\) vaut \\(${base}\\). On applique donc la fonction logarithme en base \\(${base}\\) sur les deux membres de l'équation`,
				math: `\\log_{\\textcolor{red}{ ${base} }}(\\textcolor{red}{ ${base} }^{ ${polynom.tex} }) = \\log_${base}(${value})`
			},
			{
				id: 4,
				text: `Le logarithme en base \\(${base}\\) de \\(${base}^x\\) vaut la puissance, donc \\(${polynom.tex}\\). On peut donc simplifier le membre de gauche`,
				math: `${polynom.tex} = \\log_${base}(${value})`
			}
		]
	}

	// Le polynome est de la forme ax + b
	let answer = getAnswerAsTex(polynomForAnswer, base, power, value)

	data.steps.push({
		id: 5,
		text: "On isole la variable \\(x\\) et on utilise la formule \\(\\log_n(a) = \\dfrac{\\ln(a)}{\\ln(n)}\\)",
		math: `x = ${answer}`
	})

	return data
}

function getAnswerAsTex(polynom, base, power, value, withValue = true){
	let P = polynom.clone().add(power)
	let a = P.monomByDegree().coefficient,
		b = P.monomByDegree(0).coefficient,
		answer,
		log = `\\log_${base}(${value})`,
		logvalue = (-b.value + Math.log(value)/Math.log(base))/a.value


	if(a.isPositive()){
		answer = `${b.isZero()?"":b.opposed().tex + "+"}${log}`
	}else{
		answer = `${b.isZero()?"":b.tex + "-"}${log}`
	}

	if(!a.isOne() || a.isNegativeOne()){
		answer = `\\frac{ ${answer} }{ ${a.clone().abs().tex} }`
	}

	if(withValue){
		return `${answer}=${answer.replace(log, `\\frac{ \\ln(${value}) }{ \\ln(${base}) }`)}\\approx ${logvalue.toFixed(3)}`
	}else{
		return answer
		// return answer.replace(log, `\\frac{ \\ln(${value}) }{ \\ln(${base}) }`)
	}

}

function generateQuestions() {
	let data = []
	for(let i=0; i<20; i++){
		let base = PiMath.Random.number(2, 9),
			power = PiMath.Random.number(2, 3),
			bp = base ** power,
			value = PiMath.Random.number(2, 20),
			polynom = PiMath.Random.polynom({
				degree: 1
			})

		data.push({
			question: `${bp}\\cdot${base}^{ ${polynom.tex} } = ${value}`,
			answer: `x = ${getAnswerAsTex(polynom, base, power, value, false)}`
		})
	}

	return data
}
</script>
