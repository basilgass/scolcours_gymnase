<template>
	<div ref="root">
		<ExampleTitle>Aire entre une parabole et l'axe \(O_x\)</ExampleTitle>
		
		<ChapterExercise :steps="steps">
			Calculer l'aire entre \(f(x)= \dfrac{1}{4}x^2-\dfrac{7}{4}x-2\) et l'axe \(O_x\)
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
import { onMounted, ref } from 'vue'
import ExampleTitle from '@/Components/Ui/ExampleTitle'
import ChapterExercise from '@/Components/Ui/ChapterExercise'

const root = ref(null),
	graphBetweenContainer = ref(null)

let graphBetween

let steps = [
	{
		'title': 'Calculer les zéros de \\(f(x)\\)',
		'body': '\\[\\dfrac{1}{4}x^2-\\frac{7}{4}x-2= 0 \\implies \\dfrac{1}{4}\\big( x^2-7x-8 \\big) = 0 \\implies \\dfrac{1}{4}(x+1 )(x-8) = 0 \\implies x=-1 \\text{ et } x = 8\\]'
	},
	{
		'title': 'Calculer l\'intégrale définie bornée entre les deux zéros',
		'body': '\\[\\displaystyle \\int_{-1}^{8} \\frac{1}{4}x^2-\\frac{7}{4}x-2 \\ \\text{d}x = \\frac{1}{12}x^3 - \\frac{7}{8}x^2-2x \\Big\\vert_{-1}^8 \\approx -\\frac{88}{3} - \\frac{25}{24} = -\\frac{243}{8} = -30.375\\]'
	},
	{
		'title': 'En déduire l\'aire',
		'body': 'L\'aire entre la courbe et l\'axe \\(O_x\\) vaut \\(\\big\\vert-30.375\\big\\vert = 30.375\\)'
	}
]
function loadGraphBetween () {
	graphBetween = new PiDraw(graphBetweenContainer.value, {
		origin: {
			x: 200,
			y: 200
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot('1/4*x^2-7/4*x-2') // '1/4*(x+8)*(x-1)
	graphBetween.point(-1,0).asCircle()
	graphBetween.point(8,0).asCircle()
	
	fx.fillBetween(false, -1, 8)
}

onMounted(() => {
	katexAutoRender(root.value)
	
	loadGraphBetween()
})

</script>