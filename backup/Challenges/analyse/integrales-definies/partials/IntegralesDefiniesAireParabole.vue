<template>
	<div ref="root">
		<ExampleTitle>Aire entre une parabole et l'axe \(O_x\)</ExampleTitle>

		<ChapterExercise :steps="steps">
			<template #illustration>
				<div
					ref="graphBetweenContainer"
					class="max-w-lg"
				/>
			</template>
			Calculer l'aire entre \(f(x)= -\dfrac{1}{2}x^2+2x+6\) et l'axe \(O_x\)
		</ChapterExercise>
	</div>
</template>
<script setup>
import {onMounted, ref} from "vue"
import ExampleTitle from "@/Components/Ui/ExampleTitle.vue"
import ChapterExercise from "@/Components/Chapters/Exercises/ChapterExercise"
import {PiDraw} from "pidraw/esm"

const root = ref(null),
	graphBetweenContainer = ref(null),
	solutions = ref(0)

let graphBetween

let steps = [
	{
		title: "Calculer les zéros de \\(f(x)\\)",
		body: "\\[-\\dfrac{1}{2}x^2+2x+6= 0 \\implies -\\dfrac{1}{2}\\big( x^2-4x-12 \\big) = 0 \\implies -\\dfrac{1}{2}(x+2 )(x-6) = 0 \\implies x=-2 \\text{ et } x = 6\\]"
	},
	{
		title: "Calculer l'intégrale définie bornée entre les deux zéros",
		body: "\\[\\displaystyle \\int_{-2}^{6} -\\frac{1}{2}x^2+2x+6 \\ \\text{d}x = -\\frac{1}{6}x^3+x^2+6x \\Big\\vert_{-2}^6 = 36 - \\left(-\\frac{20}{3}\\right) = \\frac{128}{3} \\approx 42.7\\]"
	},
	{
		title: "En déduire l'aire",
		body: "L'aire entre la courbe et l'axe \\(O_x\\) vaut \\(\\approx 42.7\\)"
	}
]
function loadGraphBetween () {
	graphBetween = new PiDraw(graphBetweenContainer.value, {
		origin: {
			x: 300,
			y: 550
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot("-1/2*x^2+2*x+6")
	graphBetween.point(-2,0).asCircle()
	graphBetween.point(6,0).asCircle()

	let FB = fx.fillBetween(false, -2, 6)
}

onMounted(() => {
	katexAutoRender(root.value)

	loadGraphBetween()
})

</script>
