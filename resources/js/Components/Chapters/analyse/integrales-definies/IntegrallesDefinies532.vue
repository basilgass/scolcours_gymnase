<template>
	<div ref="root">
		<ExampleTitle>Exercice 5.32</ExampleTitle>
		<ChapterExercise :steps="steps">
			Calculer l'aire de la partie hachurée entre \(y=-x\) et \(y=\sqrt{2-x}\)
			<template #illustration>
				<div
					ref="graphBetweenContainer"
					class="max-w-lg"
				/>
			</template>
		</ChapterExercise>
	</div>
</template>

<script setup>
import {onMounted, ref} from "vue"
import ExampleTitle from "@/Components/Ui/ExampleTitle"
import ChapterExercise from "@/Components/Ui/ChapterExercise"
import {PiDraw} from "pidraw/esm"

const root = ref(null),
	graphBetweenContainer = ref(null),
	solutions = ref(0)

let graphBetween

let steps = [
	{
		"title": "Calculer \\(a\\), la coordonnée \\(x\\) du point d'intersection entre \\(y = -x\\) et \\(y = \\sqrt{2-x}\\)",
		"body": `Résolution de l'équation \\(-x = \\sqrt{2-x}\\)
				\\[\\begin{aligned}
				-x =& \\sqrt{2-x} \\\\
				x^2 =& 2-x \\\\
				x^2+x-2 =&0 \\\\
				(x+2)(x-1) =& 0\\\\
				\\end{aligned}\\]
				On obtient \\(x=-2 \\in \\text{ED}\\) et \\(x=1 \\not\\in\\text{ED}\\) (car une racine est positive)`
	},
	{
		"title": "Calculer \\(b\\), la coordonnée \\(x\\) du point d'intersection entre \\(y = \\sqrt{2-x}\\) et l'axe \\(O_x\\)",
		"body": "\\[\\sqrt{2-x}=0 \\implies 2-x = 0 \\implies x = 2\\]"
	},
	{
		"title": "Calculer les intégrales définies \\[\\mathcal{A}_1 = \\int_a^b\\sqrt{x-2}\\ \\text{d}x \\qquad \\qquad \\mathcal{A}_2=\\int_a^0 -x \\ \\text{d}x\\]",
		"body": `\\[\\mathcal{A}_1 = \\int_{-2}^{2} \\sqrt{2-x}\\ \\text{d}x = -\\int_{-2}^{2} -1 \\cdot \\underbrace{\\sqrt{2-x}}_{()' = -1}\\ \\text{d}x = -\\frac{2}{3}\\sqrt{2-x}^3 \\Big\\vert_{-2}^{2} = 0-\\left(-\\frac{2}{3}\\cdot 8\\right) = -\\frac{16}{3}\\]
		\\[\\mathcal{A}_2 = \\int_{-2}^{0} -x \\ \\text{d}x = -\\frac{1}{2}x^2\\Big\\vert_{-2}^{0} = 0 - \\left( -\\frac{1}{2}\\cdot 4 \\right) = 2\\]`
	},
	{
		"title": "Calculer l'aire de la surface colorée \\(\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert\\)",
		"body": "L'aire de la figure hachurée est \\[\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert = \\frac{16}{3} - 2 = \\frac{10}{3}\\]"
	}
]

function loadGraphBetween () {
	graphBetween = new PiDraw(graphBetweenContainer.value, {
		grid: {
			x: 100,
			y: 100
		},
		origin: {
			x: 300,
			y: 500
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot("-x"),
		fxSqrt = graphBetween.plot("sqrt(2-x)", {
			domain: {
				min: -4,
				max: 2
			},
			samples: 20
		})

	fxSqrt.fillBetween(fx, -2, 0.01)
	fxSqrt.fillBetween(false, 0, 2)
}

onMounted(() => {
	katexAutoRender(root.value)

	loadGraphBetween()
})

</script>
