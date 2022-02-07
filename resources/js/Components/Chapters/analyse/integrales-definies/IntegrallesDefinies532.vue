<template>
	<div ref="root">
		<ExampleTitle>Exercice 5.32</ExampleTitle>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<div
				ref="graphBetweenContainer"
				class="max-w-lg"
			/>
			
			<div>
				Calculer l'aire de la partie hachurée entre \(y=-x\) et \(y=\sqrt{2-x}\)
				
				<h3 class="mt-8 mb-4 font-semibold">
					Marche à suivre
				</h3>
				<ol class="list-decimal list-space space-y-4">
					<li>
						Calculer \(a\), la coordonnée \(x\) du point d'intersection entre \(y = -x\) et
						\(y = \sqrt{2-x}\)
					</li>
					<li>Calculer \(b\), la coordonnée \(x\) du point d'intersection entre \(y = \sqrt{2-x}\) et l'axe \(O_x\)</li>
					<li>
						Calculer les intégrales définies
						<div
							v-katex="`\\mathcal{A}_1 = \\int_a^b\\sqrt{x-2}\\ \\text{d}x \\qquad \\qquad \\mathcal{A}_2=\\int_a^0 -x \\ \\text{d}x`"
						/>
					</li>
					<li>
						Calculer l'aire de la surface colorée <span v-katex.boxed.display="`\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert`" />
					</li>
				</ol>
			</div>
			
			<div class="lg:col-span-2">
				<div class="flex items-center mt-8 mb-4 space-x-10">
					<h3 class="font-semibold">
						Résolution
					</h3>
					<button
						v-show="solutions<4"
						class="btn px-2 py-1"
						@click="solutions++"
					>
						Etape suivante
					</button>
				</div>
				
				<ol class="list-decimal list-space space-y-4">
					<li v-show="solutions>0">
						Résolution de l'équation \(-x = \sqrt{2-x}\)
						<div
							v-katex.left="`
						\\begin{aligned}
						-x =& \\sqrt{2-x} \\\\
						x^2 =& 2-x \\\\
						x^2+x-2 =&0 \\\\
						(x+2)(x-1) =& 0\\\\
						\\end{aligned}
						`"
						/>
						On obtient \(x=-2 \in \text{ED}\) et \(x=1 \not\in\text{ED}\) (car une racine est positive)
					</li>
					<li v-show="solutions>1">
						<span v-katex.display.boxed="`\\sqrt{2-x}=0 \\implies 2-x = 0 \\implies x = 2`" />
					</li>
					<li v-show="solutions>2">
						<div v-katex.left="`\\mathcal{A}_1 = \\int_{-2}^{2} \\sqrt{2-x}\\ \\text{d}x = -\\int_{-2}^{2} -1 \\cdot \\underbrace{\\sqrt{2-x}}_{()' = -1}\\ \\text{d}x = -\\frac{2}{3}\\sqrt{2-x}^3 \\Big\\vert_{-2}^{2} = 0-\\left(-\\frac{2}{3}\\cdot 8\\right) = -\\frac{16}{3}`" />
						
						<div v-katex.left="`\\mathcal{A}_2 = \\int_{-2}^{0} -x \\ \\text{d}x = -\\frac{1}{2}x^2\\Big\\vert_{-2}^{0} = 0 - \\left( -\\frac{1}{2}\\cdot 4 \\right) = 2`" />
					</li>
					<li v-show="solutions>3">
						L'aire de la figure hachurée est <span v-katex.boxed.display="`\\left\\vert\\mathcal{A}_1\\right\\vert - \\left\\vert\\mathcal{A}_2\\right\\vert = \\frac{16}{3} - 2 = \\frac{10}{3}`" />
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
	let fx = graphBetween.plot('-x'),
		fxSqrt = graphBetween.plot('sqrt(2-x)', {
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
