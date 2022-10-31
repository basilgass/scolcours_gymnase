<template>
	<section>
		<chapter-article>
			<template #title>
				Propriétés
			</template>

			<chapter-formulas :chapter="$page.props.chapter" />
		</chapter-article>
		<chapter-article>
			<template #title>
				Equations exponentielles
			</template>

			<chapter-exercise-steps :content="example1" />
			<chapter-exercise-steps :content="example2" />

			<what-to-know
				class="max-w-xl mt-3 mb-10"
				title="équations exponentielles"
				slug="equations-exponentielles"
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

			<chapter-exercise-steps :content="example3" />
			<chapter-exercise-steps :content="example4" />

			<what-to-know
				class="max-w-xl mt-3 mb-10"
				title="équations logarithmiques"
				slug="equations-logarithmiques"
				:questions="generateQuestionLog"
				sep=""
				pre-answer-sep=" \implies "
			>
				Résoudre les équations exponentielles suivantes. Réponse sous forme exacte.
			</what-to-know>
		</chapter-article>
	</section>
</template>

<script setup>
/** Chapter
 * title: exponentielles et logarithmes
 * body: L'étude des fonctions et équations exponentielles
 */
import ChapterArticle from "@/Components/backup/ChapterArticle.vue"
import {PiMath} from "pimath/esm"
import ChapterExerciseSteps from "@/Components/Chapters/Exercises/ChapterExerciseSteps"
import WhatToKnow from "@/Components/Ui/WhatToKnow"
import {SimpleExercise} from "@/scolcours"
import ChapterFormulas from "@/Components/Chapters/Formulas/ChapterFormulas"

function example1() {
	let base = PiMath.Random.number(2, 9),
		value = PiMath.Random.number(2, 20)

	let EX = new SimpleExercise(
		"",
		`Résoudre l'équation \\[${base}^x=${value}\\]`
	)

	EX.addData(
		`La radical sour la puissance \\(x\\) vaut \\(${base}\\). On applique donc la fonction logarithme en base \\(${base}\\) sur les deux membres de l'équation`,
		`\\log_{\\textcolor{red}{ ${base} }}(\\textcolor{red}{ ${base} }^x) = \\log_${base}(${value})`
	)
	EX.addData(
		`Le logarithme en base \\(${base}\\) de \\(${base}^x\\) vaut la puissance, donc \\(x\\). On peut donc simplifier le membre de gauche`,
		`x = \\log_${base}(${value})`
	)
	EX.addData(
		"On utilise la formule \\(\\log_n(a) = \\dfrac{\\ln(a)}{\\ln(n)}\\) qui permet d'utiliser une calculette",
		`x = \\frac{\\ln(${value})}{\\ln(${base})} \\approx ${(Math.log(value) / Math.log(base)).toFixed(3)}`
	)
	return EX

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

	let EX = new SimpleExercise(
		"",
		`Résoudre l'équation \\[${bp}\\cdot${base}^{ ${polynom.tex} } = ${value}\\]`
	)

	EX.addData(
		`Le premier facteur \\(${bp}\\) est une puissance de \\(${base}\\).`,
		`${base}^{ ${power} }\\cdot${base}^{ ${polynom.tex} } = ${value}`
	)
	EX.addData(
		"Les deux facteurs du membre de gauche ont le même radical. On peut additionner les puissances.",
		`${base}^{ ${polynom.add(power).tex} } = ${value}`
	)
	EX.addData(
		`La radical sous la puissance \\(${polynom.tex}\\) vaut \\(${base}\\). On applique donc la fonction logarithme en base \\(${base}\\) sur les deux membres de l'équation`,
		`\\log_{\\textcolor{red}{ ${base} }}(\\textcolor{red}{ ${base} }^{ ${polynom.tex} }) = \\log_${base}(${value})`
	)
	EX.addData(
		`Le logarithme en base \\(${base}\\) de \\(${base}^{ ${polynom.tex} }\\) vaut la puissance, donc \\(${polynom.tex}\\). On peut donc simplifier le membre de gauche`,
		`${polynom.tex} = \\log_${base}(${value})`
	)

	// Le polynome est de la forme ax + b
	let answer = getAnswerAsTex(polynomForAnswer, base, power, value)

	EX.addData(
		"On isole la variable \\(x\\) et on utilise la formule \\(\\log_n(a) = \\dfrac{\\ln(a)}{\\ln(n)}\\)",
		`x = ${answer}`
	)
	return EX
}

function getAnswerAsTex(polynom, base, power, value, withValue = true) {
	let P = polynom.clone().add(power)
	let a = P.monomByDegree().coefficient,
		b = P.monomByDegree(0).coefficient,
		answer,
		log = `\\log_${base}(${value})`,
		logvalue = (-b.value + Math.log(value) / Math.log(base)) / a.value


	if (a.isPositive()) {
		answer = `${b.isZero() ? "" : b.opposed().tex + "+"}${log}`
	} else {
		answer = `${b.isZero() ? "" : b.tex + "-"}${log}`
	}

	if (!a.isOne() || a.isNegativeOne()) {
		answer = `\\frac{ ${answer} }{ ${a.clone().abs().tex} }`
	}

	if (withValue) {
		return `${answer}=${answer.replace(log, `\\frac{ \\ln(${value}) }{ \\ln(${base}) }`)}\\approx ${logvalue.toFixed(3)}`
	} else {
		return answer
		// return answer.replace(log, `\\frac{ \\ln(${value}) }{ \\ln(${base}) }`)
	}

}

function generateQuestions() {
	let data = []
	for (let i = 0; i < 20; i++) {
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

function example3() {
	let base = PiMath.Random.number(2, 9),
		value = PiMath.Random.number(1, 15),
		polynom = PiMath.Random.polynom({
			degree: 1,
			unit: true
		}),
		a = polynom.monomByDegree(0).clone().opposed(),
		answer = Math.pow(base, value) + a.coefficient.value

	let EX = new SimpleExercise(
		"",
		`Résoudre l'équation \\[ \\log_${base}(${polynom.tex}) = {${value}} \\]`
	)


	EX.addData(
		`On applique la fonction \\(f(x) = ${base}^x\\) sur chaque membre de l'équation.`,
		`\\textcolor{red}{${base}}^{ \\log_{\\textcolor{red}{${base}}}(${polynom.tex}) } = ${base}^{${value}}`
	)

	EX.addData(
		"Comme le radical et la base du logarithme sont les mêmes, on peut simplifier le membre de droite",
		`${polynom.tex} = ${base}^{${value}}`
	)

	EX.addData(
		"On termine la résolution en isolant la variable \\(x\\)",
		`x = ${base}^{${value}} ${a.texWithSign} = ${answer}`
	)

	return EX
}

function example4() {
	let polynomL = PiMath.Random.polynom({
			degree: 2,
			unit: true,
			factorable: true
		}),
		polynomFinal = PiMath.Random.polynom({
			degree: 2,
			unit: true,
			factorable: true
		}),
		polynomR = polynomL.clone().subtract(polynomFinal).reduce().reorder(),
		answer = 0

	let EqLnLeft = new PiMath.Equation(polynomL, "0"),
		EqLnRight = new PiMath.Equation(polynomR, "0")

	EqLnLeft.sign = ">"
	EqLnLeft.solve()

	EqLnRight.sign = ">"
	EqLnRight.solve()

	let EX = new SimpleExercise(
		"",
		`Résoudre l'équation \\[ \\ln( ${polynomL.tex} ) - \\ln(${polynomR.tex}) = 0 \\]`
	)

	EX.addData(
		`On déplace \\( \\ln(${polynomR.tex})  \\) à droite pour obtenir un seul \\(\\ln\\) à droite et à gauche`,
		`\\ln( ${polynomL.tex} ) = \\ln(${polynomR.tex}) `
	)

	EX.addData(
		"Avant de commencer, il faut déterminer l'ensemble de définition des solutions",
		`\\begin{aligned}
		\\text{ED}_{${polynomL.tex}} &= ${EqLnLeft.solutions[0].tex} \\\\
		\\text{ED}_{ ${polynomR.tex} } &= ${EqLnRight.solutions[0].tex} \\\\
		\\text{ED} &= \\text{ED}_{${polynomL.tex}} \\cap \\text{ED}_{ ${polynomR.tex} } =

		\\end{aligned}
		`
	)

	EX.addData(
		"On applique la fonction exponentielle \\( \\text{e}^x \\) sur les deux membres de l'équation",
		`\\text{e}^{ \\ln( ${polynomL.tex} ) } = \\text{e}^{ \\ln( ${polynomR.tex} ) }`
	)
	EX.addData(
		"On peut simplifier les deux membres de l'équation",
		`${polynomL.tex} = ${polynomR.tex}`
	)
	EX.addData(
		"Pour résoudre une équation du 2ème degré, on déplace tout d'un côté",
		`${polynomL.clone().subtract(polynomR).reorder().tex} = 0`
	)


	let factorizedEq = new PiMath.Equation(polynomL, polynomR)
	factorizedEq.solve()

	let finalSolutions = []

	let solutions = factorizedEq.solutions.map(x => {
		if (isNaN(x.value)) {
			x.inDomain = x.tex === "\\mathbb{R}"
		} else {
			x.inDomain = EqLnLeft.left.evaluate(x.value).isStrictlyPositive() && EqLnRight.left.evaluate(x.value).isStrictlyPositive()
		}

		if (!isNaN(x.value) && !x.exact) {
			x.tex += `\\approx${x.value.toFixed(3)}`
		}

		if (x.inDomain) {
			finalSolutions.push(x)
		}
		return x
	})

	// Format the solutons
	if (finalSolutions.length > 0) {
		finalSolutions = finalSolutions.map(x => x.tex)

		if (finalSolutions.includes("\\mathbb{R}")) {
			finalSolutions = "\\text{ED}"
		} else {
			finalSolutions = `\\left\\lbrace ${finalSolutions.join(";")} \\right\\rbrace`
		}
	} else {
		finalSolutions = "\\varnothing"
	}

	if (solutions.length === 2) {
		EX.addData(
			"On obtient deux solutions \\(x_1\\) et \\(x_2\\). Il faut alors vérifier que \\(x_1,x_2 \\in \\text{ED}\\)",
			`
		\\begin{aligned}
			x_1 &= ${solutions[0].tex} & \\implies x_1 ${solutions[0].inDomain ? "" : "\\not"}\\in \\text{ED} \\\\\\
			x_2 &= ${solutions[1].tex} & \\implies x_2 ${solutions[1].inDomain ? "" : "\\not"}\\in \\text{ED} \\\\\\
			S &= ${finalSolutions}
		 \\end{aligned}
		 `
		)
	} else {
		if (solutions[0].tex === "\\varnothing") {
			EX.addData(
				"On n'obtient aucune solution... C'est triste.",
				"S=\\varnothing"
			)
		} else if (solutions[0].tex === "\\mathbb{R}") {
			EX.addData(
				"On obtient une infinité de solution, qui doivent appartenir à l'ensemble de définition",
				"S = \\text{ED} = "
			)
		} else {
			EX.addData(
				"On obtient une solutions \\(x_1\\). Il faut alors vérifier que \\(x_1 \\in \\text{ED}\\)",
				`
		\\begin{aligned}
			x_1 &= ${solutions[0].tex} & \\implies x_1 ${solutions[0].inDomain ? "" : "\\not"}\\in \\text{ED} \\\\\\
		 \\end{aligned}
		 `
			)
		}
	}


	return EX
}

function generateQuestionLog() {
	let data = []
	for (let i = 0; i < 20; i++) {
		let polynomL = PiMath.Random.polynom({
				degree: 2,
				unit: true,
				factorable: true
			}),
			polynomFinal = PiMath.Random.polynom({
				degree: 2,
				unit: true,
				factorable: true
			}),
			polynomR = polynomL.clone().subtract(polynomFinal).reduce().reorder()

		let EqLnLeft = new PiMath.Equation(polynomL, "0"),
			EqLnRight = new PiMath.Equation(polynomR, "0")

		EqLnLeft.sign = ">"
		EqLnLeft.solve()

		EqLnRight.sign = ">"
		EqLnRight.solve()
		let factorizedEq = new PiMath.Equation(polynomL, polynomR)
		factorizedEq.solve()

		let finalSolutions = []

		let solutions = factorizedEq.solutions.map(x => {
			if (isNaN(x.value)) {
				x.inDomain = x.tex === "\\mathbb{R}"
			} else {
				x.inDomain = EqLnLeft.left.evaluate(x.value).isStrictlyPositive() && EqLnRight.left.evaluate(x.value).isStrictlyPositive()
			}

			if (!isNaN(x.value) && !x.exact) {
				x.tex += `\\approx${x.value.toFixed(3)}`
			}

			if (x.inDomain) {
				finalSolutions.push(x)
			}
			return x
		})

		// Format the solutons
		if (finalSolutions.length > 0) {
			finalSolutions = finalSolutions.map(x => x.tex)

			if (finalSolutions.includes("\\mathbb{R}")) {
				finalSolutions = "\\text{ED}"
			} else {
				finalSolutions = `\\left\\lbrace ${finalSolutions.join(";")} \\right\\rbrace`
			}
		} else {
			finalSolutions = "\\varnothing"
		}

		data.push({
			question: `\\ln( ${polynomL.tex} ) - \\ln(${polynomR.tex}) = 0`,
			answer: `S = ${finalSolutions}`
		})
	}

	return data
}
</script>
