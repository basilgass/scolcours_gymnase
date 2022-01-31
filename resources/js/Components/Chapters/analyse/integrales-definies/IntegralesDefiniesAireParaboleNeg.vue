<template>
	<div ref="root">
		<ExampleTitle>Aire entre une parabole et l'axe \(O_x\)</ExampleTitle>
		
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<div
				ref="graphBetweenContainer"
				class="max-w-lg"
			/>
			
			<div>
				Calculer l'aire entre \(f(x)= \dfrac{1}{4}x^2-\dfrac{7}{4}x-2\) et l'axe \(O_x\)
				
				<h3 class="mt-8 mb-4 font-semibold">
					Marche à suivre
				</h3>
				<ol class="list-decimal list-inside space-y-4">
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
				
				<ol class="list-decimal list-inside space-y-4">
					<li v-show="solutions>0">
						\(\dfrac{1}{4}x^2-\frac{7}{4}x-2= 0 \implies \dfrac{1}{4}\big( x^2-7x-8 \big) = 0 \implies \dfrac{1}{4}(x+1 )(x-8) = 0 \implies x=-1 \text{ et } x = 8\)
					</li>
					<li v-show="solutions>1">
						\( \displaystyle \int_{-1}^{8} \frac{1}{4}x^2-\frac{7}{4}x-2 \ \text{d}x = \frac{1}{12}x^3 - \frac{7}{8}x^2-2x \Big\vert_{-1}^8 \approx -\frac{88}{3} - \frac{25}{24} = -\frac{243}{8} = -30.375\)
					</li>
					<li v-show="solutions>2">
						L'aire entre la courbe et l'axe \(O_x\) vaut \(\big\vert-30.375\big\vert = 30.375\)
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
			x: 200,
			y: 200
		}
	})
	graphBetween.axis()
	graphBetween.plot('1/4*x^2-7/4*x-2') // '1/4*(x+8)*(x-1)
	graphBetween.point(-1,0).asCircle()
	graphBetween.point(8,0).asCircle()
}

onMounted(() => {
	katexAutoRender(root.value)
	
	loadGraphBetween()
})

</script>