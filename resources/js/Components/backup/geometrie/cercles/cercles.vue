<template>
	<chapter-article>
		<template #title>
			équations cartésiennes et équation centre-rayon
		</template>
		<div>
			Un cercle est donné par les coordonnées d'un point (son centre) et son rayon.
		</div>

		<div
			v-if="equ!==undefined"
			class="flex flex-col divide-y"
		>
			<div class="flex-1 flex gap-x-10 items-center">
				<div class="text-right flex-1">
					équation cartésienne
				</div>
				<div
					v-katex.left="equ.developed"
					class="flex-1"
				/>
			</div>
			<div class="flex-1 flex gap-x-10 items-center">
				<div class="text-right flex-1">
					équation centre-rayon
				</div>
				<div
					v-katex.left="equ.tex"
					class="flex-1"
				/>
			</div>
			<div class="flex-1 flex gap-x-10 items-center">
				<div class="text-right flex-1">
					centre et rayon
				</div>
				<div
					v-katex.left="`C${equ.center.tex} \\text{ et }r=${equ.radius.tex}`"
					class="flex-1"
				/>
			</div>
			<div class="grid grid-cols-2 gap-x-10">
				<form-point
					v-model="center"
					name="center"
					label="centre"
				/>
				<form-fraction
					v-model="radius"
					name="radius"
					label="rayon"
				/>
			</div>
		</div>

		<h3 class="font-semibold">
			Transformation de l'équation cartésienne à l'équation centre-rayon
		</h3>

		<div v-katex="cartesianToCenterRadius" />
	</chapter-article>

	<chapter-article>
		<template #title>
			équation du cercle passant par trois points
		</template>
		<div>
			Pour calculer l'équation du cercle passant par 3 points \(A\), \(B\) et \(C\), il faut
			calculer l'intersection des deux des trois médiatrices \(m_{AB}\), \(m_{AC}\) ou \(m_{BC}\).
		</div>

		<pi-draw-parser
			class="max-w-lg mx-auto"
			:draw="{
				code: drawCode,
				parameters: drawParameters
			}"
			axis
		/>

		<chapter-exercise-steps
			:content="equationsPar3Points"
			developed
		/>
	</chapter-article>
</template>

<script setup>
import ChapterArticle from "@/Components/backup/ChapterArticle.vue"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormPoint from "@/Components/Form/FormPoint"
import FormFraction from "@/Components/Form/FormFraction"
import PiDrawParser from "@/Components/Pi/PiDrawParser"
import ChapterExerciseSteps from "@/Components/Chapters/Exercises/ChapterExerciseSteps"
import {SimpleExercise} from "@/scolcours"

/** Chapter
 * title: équation cartésienne d'un cercle
 * body: équation d'un cercle, sous la forme centre-rayon
 */

let center = ref("-3,5"),
	radius = ref("7"),
	drawCode = ref(""),
	drawParameters = ref("")

let equ = computed(() => {
	try {
		let P = new PiMath.Geometry.Point(center.value),
			r = new PiMath.Fraction(radius.value)
		return new PiMath.Geometry.Circle(P, r)
	} catch {
		return undefined
	}
})
let cartesianToCenterRadius = computed(() => {
	if (equ.value === undefined) {
		return ""
	}

	function makeEquLeft(letter, value, color) {
		let value2 = value.clone().multiply(-2),
			valueX = value.clone().pow(2),
			valueO = value.clone().opposed()

		if (value.isNotZero()) {
			return [
				`${letter}^2${value2.texWithSign}${letter}`,
				`${letter}^2 ${value2.texWithSign}${letter} \\phantom{+${valueX.tex}}`,
				`\\underbrace{ ${letter}^2 ${value2.texWithSign}${letter} \\textcolor{${color}}{+${valueX.tex}} }_{ \\left(${letter}${valueO.texWithSign}\\right)^2 }`,
				`\\left(${letter}${valueO.texWithSign}\\right)^2`
			]
		} else {
			return [
				`${letter}^2`,
				`${letter}^2`,
				`${letter}^2`,
				`${letter}^2`
			]
		}
	}

	function makeEquRight(c, valueX, valueY, colorX, colorY) {
		let co = c.clone().opposed(),
			xx = valueX.clone().pow(2),
			yy = valueY.clone().pow(2),
			r = co.clone().add(xx).add(yy),
			part1 = `${co.tex}`,
			part2 = `${part1}`

		if (valueX.isNotZero()) {
			part2 += ` \\textcolor{${colorX}}{+${xx.tex}}`
		}
		if (valueY.isNotZero()) {
			part2 += ` \\textcolor{${colorY}}{+${yy.tex}}`
		}
		return [
			"0",
			part1,
			`${part2}`,
			`${r.tex}`
		]
	}

	let x = equ.value.center.x,
		y = equ.value.center.y,
		c = equ.value.cartesian.left.monomByDegree(0).coefficient.clone(),
		equX = makeEquLeft("x", x, "red"),
		equY = makeEquLeft("y", y, "blue"),
		equRight = makeEquRight(c, x, y, "red", "blue")

	return `\\begin{aligned}
	${equX[0]}+${equY[0]}${c.texWithSign} &= ${equRight[1]} \\\\
	${equX[1]}+${equY[1]} &= ${equRight[1]} \\\\
	${equX[2]}+${equY[2]} &= ${equRight[2]} \\\\
	${equX[3]}+${equY[3]} &= ${equRight[3]}
	\\end{aligned}`
})

function generateCircle(numberOfPoints) {
	// Création d'un cercle avec au moins 6 points entiers ou plus.
	let maxLoop = 100,
		i = 0, targetPoints = 6,
		x, y, r, circle, pts

	while (i < maxLoop) {
		x = PiMath.Random.number(-5, 5)
		y = PiMath.Random.number(-5, 5)
		r = PiMath.Random.number(5, 17)
		circle = new PiMath.Geometry.Circle(new PiMath.Geometry.Point(x, y), r, true)
		pts = circle.getPointsOnCircle()

		if (pts.length >= targetPoints) {
			break
		}

		if(i>maxLoop/1.5){
			targetPoints = 4
		}
	}

	if (numberOfPoints > 0) {
		pts = PiMath.Random.array(pts, numberOfPoints)
	}
	return {circle, pts}
}

function equationsPar3Points() {
	// Création d'un cercle avec au moins 6 points entiers ou plus.
	let x = PiMath.Random.number(-5, 5),
		y = PiMath.Random.number(-5, 5),
		r = PiMath.Random.number(5, 17)

	console.log(x, y, r)
	// Création d'un cercle avec...

	let {circle, pts} = generateCircle(3),
		A = pts[0],
		B = pts[1],
		C = pts[2],
		MAB = new PiMath.Geometry.Point().middleOf(A, B),
		MAC = new PiMath.Geometry.Point().middleOf(A, C),
		MBC = new PiMath.Geometry.Point().middleOf(B, C),
		AB = new PiMath.Geometry.Vector(A, B),
		AC = new PiMath.Geometry.Vector(A, C),
		BC = new PiMath.Geometry.Vector(B, C),
		dAB = new PiMath.Geometry.Line(MAB, AB, PiMath.Geometry.Line.PERPENDICULAR),
		dAC = new PiMath.Geometry.Line(MAC, AC, PiMath.Geometry.Line.PERPENDICULAR),
		dBC = new PiMath.Geometry.Line(MBC, BC, PiMath.Geometry.Line.PERPENDICULAR),
		cAB = AB.x.clone().multiply(MAB.x).add(AB.y.clone().multiply(MAB.y)).opposed(),
		cAC = AC.x.clone().multiply(MAC.x).add(AC.y.clone().multiply(MAC.y)).opposed(),
		cBC = BC.x.clone().multiply(MBC.x).add(BC.y.clone().multiply(MBC.y)).opposed()

	drawParameters.value = [
		circle.center.x.value - 6,
		circle.center.x.value + 6,
		circle.center.y.value - 7,
		circle.center.y.value + 5,
		60
	].join(",")
	drawCode.value = `A(${A.x.value},${A.y.value})*
				B(${B.x.value},${B.y.value})*
				C(${C.x.value},${C.y.value})*
				O(${circle.center.x.value},${circle.center.y.value})*
			c=circ O,${circle.radius.value}
			d1=[AC]
			d2=[BC]
			d3=[AB]
			M1=mid AC
			M2=mid BC
			M3=mid AB
			m1=perp d1,M1->dash,lightgray
			m2=perp d2,M2->dash,lightgray
			m3=perp d3,M3->dash,lightgray
	`

	let EX = new SimpleExercise(
		"",
		`Calculer l'équation centre-rayon d'un cercle passant par \\(A${A.tex}\\), \\(B${B.tex}\\) et \\(C${C.tex}\\)`
	)
	EX.addData(
		"Calculer les vecteurs \\(\\overrightarrow{AB}\\), \\(\\overrightarrow{AC}\\) et \\(\\overrightarrow{BC}\\)",
		`\\overrightarrow{AB}=${AB.tex}\\qquad\\overrightarrow{AC}=${AC.tex}\\qquad\\overrightarrow{BC}=${BC.tex}\\qquad`
	)

	EX.addData(
		"Calculer les coordonnées des milieux des segments \\(AB\\), \\(AC\\) et \\(BC\\) en utilisant \\(M_{AB}\\left( \\frac{a_1+b_1}{2} ; \\frac{a_2+b_2}{2} \\right)\\)",
		`M_{AB}${MAB.tex} \\qquad M_{AC}${MAC.tex} \\qquad M_{BC}${MBC.tex}`
	)

	// TODO: Make it more readable and add more details at the end.
	EX.addData(
		"Calculer les équations cartésiennes des médiatrices du triangle. Une médiatrice est une droite perpendiculaire et passant par le milieu d'un segment. Comme le segment est porté par un vecteur normal, il est facile de calculer l'équation cartésienne de la médiatrice.\\[\\overrightarrow{AB}=\\begin{pmatrix}a\\\\b\\end{pmatrix} \\implies d: ax+by+c=0\\] Il reste à calculer le coefficient \\(c\\) en remplaçant \\(x\\) et \\(y\\) par les coordonnées du milieu du segment.",
		`\\begin{aligned}
		 m_{AB}: \\underbrace{${AB.x.tex}x${AB.y.texWithSign}y+c=0}_{\\overrightarrow{AB}=${AB.tex}} &\\implies \\underbrace{${AB.x.tex}\\left(${MAB.x.tex}\\right)${AB.y.texWithSign}\\left(${MAB.y.tex}\\right)+c=0}_{M_{AB}${MAB.tex}} &\\implies c=${cAB.tex} &\\implies ${dAB.equation.tex}\\\\[4em]
		 m_{AC}: \\underbrace{${AC.x.tex}x${AC.y.texWithSign}y+c=0}_{\\overrightarrow{AC}=${AC.tex}} &\\implies \\underbrace{${AC.x.tex}\\left(${MAC.x.tex}\\right)${AC.y.texWithSign}\\left(${MAC.y.tex}\\right)+c=0}_{M_{AC}${MAC.tex}} &\\implies c=${cAC.tex} &\\implies ${dAC.equation.tex}\\\\[4em]
		 m_{BC}: \\underbrace{${BC.x.tex}x${BC.y.texWithSign}y+c=0}_{\\overrightarrow{BC}=${BC.tex}} &\\implies \\underbrace{${BC.x.tex}\\left(${MBC.x.tex}\\right)${BC.y.texWithSign}\\left(${MBC.y.tex}\\right)+c=0}_{M_{BC}${MBC.tex}} &\\implies c=${cBC.tex} &\\implies ${dBC.equation.tex}
		\\end{aligned}`
	)

	EX.addData(
		"On calcule l'intersection de deux de ces médiatrices pour déterminer les coordonéées du centre du cercle.",
		`\\begin{aligned}
		AB\\cap AC:& ${new PiMath.LinearSystem(dAB.equation, dAC.equation).tex}&\\implies& O${circle.center.tex}\\\\[2em]
		AB\\cap BC:& ${new PiMath.LinearSystem(dAB.equation, dBC.equation).tex}&\\implies& O${circle.center.tex}\\\\[2em]
		AC\\cap BC:& ${new PiMath.LinearSystem(dAC.equation, dBC.equation).tex}&\\implies& O${circle.center.tex}
		\\end{aligned}`
	)

	let OA = new PiMath.Geometry.Vector(A, circle.center),
		OB = new PiMath.Geometry.Vector(B, circle.center),
		OC = new PiMath.Geometry.Vector(C, circle.center)
	EX.addData(
		"Il ne reste plus qu'à calculer le rayon du cercle en calculant la norme d'un des vecteurs \\(\\overrightarrow{OA}\\), \\(\\overrightarrow{OB}\\) ou \\(\\overrightarrow{OC}\\)",
		`\\begin{aligned}
		\\left\\Vert\\overrightarrow{OA}\\right\\Vert &= \\left\\Vert ${OA.tex} \\right\\Vert &=& \\sqrt{(${OA.x.tex})^2+(${OA.y.tex})^2} &= ${circle.radius.tex}\\\\
		\\left\\Vert\\overrightarrow{OB}\\right\\Vert &= \\left\\Vert ${OB.tex} \\right\\Vert &=& \\sqrt{(${OB.x.tex})^2+(${OB.y.tex})^2} &= ${circle.radius.tex}\\\\
		\\left\\Vert\\overrightarrow{OC}\\right\\Vert &= \\left\\Vert ${OC.tex} \\right\\Vert &=& \\sqrt{(${OC.x.tex})^2+(${OC.y.tex})^2} &= ${circle.radius.tex}
		\\end{aligned}`
	)

	EX.addData(
		"On peut finalement donner l'équation du cercle",
		`\\Gamma:\\ ${circle.tex}`
	)
	return EX
}
</script>

