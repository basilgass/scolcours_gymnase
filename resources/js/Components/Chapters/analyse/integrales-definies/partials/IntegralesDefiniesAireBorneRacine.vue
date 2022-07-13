<template>
	<div ref="root">
		<ExampleTitle>Aire entre deux courbes et l'axe \(O_x\)</ExampleTitle>

		<ChapterExercise :steps="steps">
			Calculer l'aire entre \(f(x)=2x-1\) et \(g(x)=\sqrt{8x+17}\)
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
import ChapterExercise from "@/Components/Ui/Chapters/Exercises/ChapterExercise"
import {PiDraw} from "pidraw/esm"

const root = ref(null),
	graphBetweenContainer = ref(null),
	solutions = ref(0)

let graphBetween

let steps = [
	{
		title: "Calculer \\(a\\), la coordonnée \\(x\\) du point d'intersection entre \\(g(x)\\) et l'axe \\(O_x\\)",
		body: "\\[\\sqrt{8x+17} = 0\\implies 8x+17=0 \\implies x = -\\dfrac{17}{8}\\]"
	},
	{
		title: "Calculer \\(b\\), la coordonnée \\(x\\) du point d'intersection entre \\(f(x)\\) et l'axe \\(O_x\\)",
		body: "\\[2x-1 = 0 \\implies x = \\dfrac{1}{2}\\]"
	},
	{
		title: "Calculer \\(c\\), la coordonnée \\(x\\) du point d'intersection de \\(f(x)\\) et \\(g(x)\\)",
		body: "Résolution de l'équation \\(2x-1 = \\sqrt{8x+17}\\) en élevant chaque membre au carré." + `
					\\[\\begin{aligned}
2x-1 &= \\sqrt{8x+17}\\\\
					(2x-1)^2 &= 8x+17\\\\
					4x^2-4x+1 &= 8x+17\\\\
					4x^2-12x-16 &= 0\\\\
					x^2-3x-4 &= 0\\\\
					(x-4)(x+1) &= 0
					\\end{aligned}\\]
` + "On obtient \\(x = -1 \\not\\in \\text{ED}\\) et \\(x=4 \\in \\text{ED}\\)"
	},
	{
		title: "Calculer les intégrales suivantes: \\[\\mathcal{A}_1 = \\int_{a}^{c}\\ g(x) \\text{d}x \\qquad \\qquad \\mathcal{A}_2 = \\int_{b}^{c}\\ f(x) \\text{d}x\\]",
		body: "Calculer les intégrales bornées" +
			"\\[\\displaystyle \\mathcal{A}_1 = \\int_{-17/8}^{4} \\sqrt{8x+17} \\text{d}x = \\frac{2}{24}\\sqrt{8x+17}^3 \\Big\\vert_{-17/8}^{4} \\approx 28.58\\]" +
			"\\[\\displaystyle \\mathcal{A}_2 = \\int_{1/2}^{4} 2x-1 \\text{d}x = x^2-x\\Big\\vert_{1/2}^{4} = 12.25\\]"
	},
	{
		title: "Calculer l'aire du domaine borné \\(\\big\\vert\\mathcal{A}_1\\big\\vert-\\big\\vert\\mathcal{A}_2\\big\\vert\\)",
		body: "\\[\\big\\vert\\mathcal{A}_1\\big\\vert-\\big\\vert\\mathcal{A}_2\\big\\vert = 28.58-12.25 \\approx 16.33\\]"
	}

]

function loadGraphBetween () {
	graphBetween = new PiDraw(graphBetweenContainer.value, {
		origin: {
			x: 300,
			y: 500
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot("2*x-1"),
		fxSqrt = graphBetween.plot("sqrt(8*x+17)", {
			domain: {
				min: -17 / 8,
				max: 10
			},
			samples: 20
		})

	graphBetween.point(-17 / 8, 0, "A").asCircle()
	graphBetween.point(0.5, 0, "B").asCircle()
	graphBetween.point(4, 0, "C").asCircle()
	graphBetween.point(4, 7, "D").asCircle()

	fxSqrt.fillBetween(false, -17 / 8, 4)
	fx.fillBetween(false, 0.5, 4).svg.fill("red")
}

onMounted(() => {
	katexAutoRender(root.value)

	loadGraphBetween()
})

</script>
