<template>
	<section ref="root">
		<chapter-article>
			<template #title>
				Exemples
			</template>
			<what-to-know :questions="generateQuestions">
				Liste des calculs à savoir
			</what-to-know>

			<primitive-simple />
		</chapter-article>
	</section>
</template>

<script setup>
/** Chapter
 * title: Primitive ou intégrale indéfinie
 * body: calcul de primitive
 */

import {onMounted, ref} from "vue"
import PrimitiveSimple from "../../Exercise/algebre/PrimitiveSimple.vue"
import WhatToKnow from "@/Components/Ui/WhatToKnow.vue"
import {PiMath} from "pimath/esm"
import ChapterArticle from "../../../ChapterArticle.vue"

const root = ref(null)

function formatQuestion(A, pow, k) {
	let F, B, D, question = "", answer = ""

	if (pow instanceof PiMath.Fraction) {
		let numerator = pow.numerator,
			denominator = pow.denominator,
			D = A.clone().multiply(k).derivative(),
			primitivePow = pow.clone().add(1)
		F = new PiMath.Fraction(k).divide(primitivePow)

		question = (D.monoms.length === 1 ? D.tex : `\\left( ${D.tex} \\right)`) + `\\sqrt${denominator === 2 ? "" : "[" + denominator + "]"}{ ${numerator > 1 ? "\\left(" + A.tex + "\\right)^" + numerator : A.tex} }`
		answer = (F.isOne() ? "" : F.tex) + " \\cdot " + `\\sqrt${primitivePow.denominator === 2 ? "" : "[" + primitivePow.denominator + "]"}{ ${primitivePow.numerator > 1 ? "\\left(" + A.tex + "\\right)^" + primitivePow.numerator : A.tex} }`
	} else if (pow === undefined || pow === 1) {
		question = A.tex
		answer = A.primitive().tex
	} else if (pow > 1) {
		B = new PiMath.Polynom(`x^(${pow})`)
		D = A.clone().multiply(k).derivative()

		question = (D.monoms.length === 1 ? D.tex : `\\left( ${D.tex} \\right)`) + B.tex.replace("x", `\\left(${A.tex}\\right)`)
		answer = B.multiply(k).primitive().tex.replace("x", `(${A.tex})`)
	} else if (pow < -1) {
		F = new PiMath.Fraction(k).divide(pow + 1)

		question = `\\frac{ ${A.clone().multiply(k).derivative().tex} }{ ( ${A.tex} )^{ ${-pow} } }`
		if (pow + 1 < -1) {
			answer = `\\dfrac{ ${F.numerator} }{ ${F.denominator !== 1 ? F.denominator : ""} (${A.tex})^{${-(pow + 1)}} }`
		} else {
			answer = `\\dfrac{ ${F.numerator} }{ ${F.denominator !== 1 ? F.denominator + "(" + A.tex + ")" : A.tex} }`
		}
	} else if (pow === -1) {
		question = `\\dfrac{ ${A.clone().multiply(k).derivative().tex} }{ ${A.tex} }`
		answer = `${k.isOne() ? "" : k.tex + " \\cdot "}\\ln \\left( {\\left\\vert ${A.tex} \\right\\vert} \\right)`
	} else if (pow === 0) {
		D = A.clone().multiply(k).derivative()
		question = `${D.monoms.length === 1 ? D.tex : "\\left(" + D.tex + "\\right)"} \\cdot \\text{e}^{ ${A.tex} }`
		answer = `${k.isOne() ? "" : k.tex + " \\cdot "} \\text{e}^{ ${A.tex} }`
	}

	return {question, answer}
}

function generatePower(model) {
	let pow = 1

	if (model === "factors") {
		pow = PiMath.Random.number(2, 6)
	} else if (model === "rationals") {
		pow = -PiMath.Random.number(2, 6)
	} else if (model === "ln") {
		pow = -1
	} else if (model === "e") {
		pow = 0
	} else if (model === "roots") {
		pow = new PiMath.Fraction(PiMath.Random.fraction({
			max: 3,
			zero: false,
			natural: false,
			negative: false
		}))
		if (pow.isOne()) {
			pow = new PiMath.Fraction("1/2")
		} else if (pow.isNatural()) {
			pow.invert()
		}
	}

	return pow
}

function generateQuestions(randomize) {
	let questions = [], pow, n, D, maxValue = 5

	if (randomize) {
		let items = []

		// 3
		items.push({
			A: new PiMath.Random.polynom({degree: 0, fraction: {natural: true, max: maxValue}}),
			pow: 1,
			k: 1
		})

		// 3x
		items.push({
			A: new PiMath.Random.polynom({
				degree: 1,
				allowNullMonom: false,
				numberOfMonoms: 1,
				fraction: {natural: true, max: maxValue}
			}).reorder(),
			pow: 1,
			k: 1
		})

		// 3x^2
		items.push({
			A: new PiMath.Random.polynom({
				degree: PiMath.Random.number(2, 9),
				allowNullMonom: false,
				numberOfMonoms: 1,
				fraction: {natural: true, max: maxValue}
			}).reorder(),
			pow: 1,
			k: 1
		})

		// 3/2x^3
		D = new PiMath.Random.polynom({
			degree: PiMath.Random.number(2, 9),
			allowNullMonom: false,
			numberOfMonoms: 1,
			fraction: {max: 5, natural: false}
		}).reorder()
		while (D.monoms[0].coefficient.isNatural()) {
			D = new PiMath.Random.polynom({
				degree: PiMath.Random.number(2, 9),
				allowNullMonom: false,
				numberOfMonoms: 1,
				fraction: {max: 5, natural: false}
			}).reorder()
		}
		items.push({
			A: D.clone(),
			pow: 1,
			k: 1
		})

		// 3x^4+5x-4
		items.push({
			A: new PiMath.Random.polynom({
				degree: PiMath.Random.number(2, 5),
				allowNullMonom: false,
				numberOfMonoms: PiMath.Random.number(2, 3),
				fraction: {natural: true, max: maxValue}
			}).reorder(),
			pow: 1,
			k: 1
		})

		let models = ["factors", "roots", "rationals", "ln", "e"]
		for (let model of models) {

			// Basic version
			items.push({
				A: new PiMath.Random.polynom({
					degree: PiMath.Random.number(2, 5),
					allowNullMonom: false,
					numberOfMonoms: PiMath.Random.number(2, 3),
					fraction: {natural: true, max: maxValue}
				}).reorder(),
				pow: generatePower(model),
				k: new PiMath.Fraction(1)
			})
			// With a natural factor
			items.push({
				A: new PiMath.Random.polynom({
					degree: PiMath.Random.number(2, 5),
					numberOfMonoms: PiMath.Random.number(2, 3),
					fraction: {natural: true, max: maxValue}
				}).reorder(),
				pow: generatePower(model),
				k: new PiMath.Fraction(PiMath.Random.number(2, 5))
			})

			// With a fraction factor - must create the polynom.
			n = PiMath.Random.number(2, 5)
			D = new PiMath.Random.polynom({
				degree: PiMath.Random.number(1, 4),
				numberOfMonoms: PiMath.Random.number(2, 3),
				fraction: {natural: true, max: maxValue}
			}).reorder().multiply(n).primitive()
			D.multiply(D.lcmDenominator())
			items.push({
				A: D,
				pow: generatePower(model),
				k: new PiMath.Fraction(1).divide(n)
			})
		}

		for (let i of items) {
			questions.push(formatQuestion(i.A, i.pow, i.k))
		}
	} else {
		questions.push(formatQuestion(new PiMath.Polynom("7")))
		questions.push(formatQuestion(new PiMath.Polynom("3x")))
		questions.push(formatQuestion(new PiMath.Polynom("5x^3")))
		questions.push(formatQuestion(new PiMath.Polynom("2/5x^2")))
		questions.push(formatQuestion(new PiMath.Polynom("4x^2+3x+5")))
		questions.push(formatQuestion(
			new PiMath.Polynom("x^2+3x"),
			3,
			new PiMath.Fraction(1)
		))
		questions.push(formatQuestion(
			new PiMath.Polynom("2x^3+5x"),
			5,
			new PiMath.Fraction(2)
		))
		questions.push(formatQuestion(
			new PiMath.Polynom("x^2+4x"),
			3,
			new PiMath.Fraction("1/2")
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("3x^2+7x+9"),
			-3,
			new PiMath.Fraction("1"),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("x^3+9"),
			-4,
			new PiMath.Fraction(6),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("3x^4+2x^2+1"),
			-2,
			new PiMath.Fraction("1/4"),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("3x^4+2x^2+1"),
			-1,
			new PiMath.Fraction(1),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("x^3+2x^2"),
			-1,
			new PiMath.Fraction("6"),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("2x^3+x^2"),
			-1,
			new PiMath.Fraction("1/2"),
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("x^2-5"),
			0,
			new PiMath.Fraction(1)
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("x^3+4x"),
			0,
			new PiMath.Fraction(2)
		))

		questions.push(formatQuestion(
			new PiMath.Polynom("x^5+5x^3"),
			0,
			new PiMath.Fraction("1/5")
		))
	}

	for (let q of questions) {
		q.question = `\\int ${q.question} \\ \\text{d}{x}`
	}
	return questions
}

onMounted(() => {
	katexAutoRender(root.value)
})

</script>

