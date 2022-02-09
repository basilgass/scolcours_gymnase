<template>
	<div ref="root">
		<ExampleTitle>Aire entre une parabole et l'axe \(O_x\)</ExampleTitle>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<div
				ref="graphBetweenContainer"
				class="max-w-lg"
			/>
			
			<div>
				Calculer l'aire entre \(f(x)= -\dfrac{1}{2}x^2+2x+6\) et l'axe \(O_x\)
				
				<h3 class="mt-8 mb-4 font-semibold">
					Marche à suivre
				</h3>
				<ol class="list-decimal list-space space-y-4">
					<li>Calculer les zéros de \(f(x)\)</li>
					<li>Calculer l'intégrale définie bornée entre les deux zéros</li>
					<li>En déduire l'aire</li>
				</ol>
			</div>
			
			<div class="lg:col-span-2">
				<div class="flex items-center mt-8 mb-4 space-x-10">
					<h3 class=" font-semibold">
						Résolution
					</h3>
					<button
						v-show="solutions<3"
						class="btn px-2 py-1"
						@click="solutions++"
					>
						Etape suivante
					</button>
				</div>
				
				<ol class="list-decimal list-space space-y-4">
					<li v-show="solutions>0">
						<span v-katex.boxed="'-\\dfrac{1}{2}x^2+2x+6= 0 \\implies -\\dfrac{1}{2}\\big( x^2-4x-12 \\big) = 0 \\implies -\\dfrac{1}{2}(x+2 )(x-6) = 0 \\implies x=-2 \\text{ et } x = 6'" />
					</li>
					<li v-show="solutions>1">
						<span v-katex.boxed="'\\displaystyle \\int_{-2}^{6} -\\frac{1}{2}x^2+2x+6 \\ \\text{d}x = -\\frac{1}{6}x^3+x^2+6x \\Big\\vert_{-2}^6 = 36 - \\left(-\\frac{20}{3}\\right) = \\frac{128}{3} \\approx 42.7'" />
					</li>
					<li v-show="solutions>2">
						L'aire entre la courbe et l'axe \(O_x\) vaut \(\approx 42.7\)
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import { Graph } from 'pidraw/esm'
import ExampleTitle from '@/Components/Ui/ExampleTitle'

const root = ref(null),
	graphBetweenContainer = ref(null),
	solutions = ref(0)

let graphBetween
function loadGraphBetween () {
	graphBetween = new Graph(graphBetweenContainer.value, {
		origin: {
			x: 300,
			y: 550
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot('-1/2*x^2+2*x+6')
	graphBetween.point(-2,0).asCircle()
	graphBetween.point(6,0).asCircle()
	
	let FB = fx.fillBetween(false, -2, 6)
}

onMounted(() => {
	katexAutoRender(root.value)
	
	loadGraphBetween()
})

</script>