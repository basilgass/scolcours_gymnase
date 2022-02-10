<template>
	<div ref="root">
		<ExampleTitle>Aire entre deux courbes et l'axe \(O_x\)</ExampleTitle>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
			<div
				ref="graphBetweenContainer"
				class="max-w-lg"
			/>
			
			<div>
				Calculer l'aire entre \(f(x)=2x-1\) et \(g(x)=\sqrt{8x+17}\)
				
				<h3 class="mt-8 mb-4 font-semibold">
					Marche à suivre
				</h3>
				<ol class="list-decimal list-space space-y-4">
					<li>
						Calculer \(a\), la coordonnée \(x\) du point d'intersection entre \(g(x)\) et
						l'axe \(O_x\)
					</li>
					<li>
						Calculer \(b\), la coordonnée \(x\) du point d'intersection entre \(f(x)\) et
						l'axe \(O_x\)
					</li>
					<li>
						Calculer \(c\), la coordonnée \(x\) du point d'intersection de \(f(x)\) et
						\(g(x)\)
					</li>
					<li>
						Calculer les intégrales suivantes:
						<div
							v-katex.display="'\\mathcal{A}_1 = \\int_{a}^{c}\\ g(x) \\text{d}x \\qquad \\qquad \\mathcal{A}_2 = \\int_{b}^{c}\\ f(x) \\text{d}x '"
						/>
					</li>
					<li>
						Calculer l'aire du domaine borné
						\(\big\vert\mathcal{A}_1\big\vert-\big\vert\mathcal{A}_2\big\vert\)
					</li>
				</ol>
			</div>
			
			<div class="lg:col-span-2">
				<div class="flex items-center mt-8 mb-4 space-x-10">
					<h3 class="font-semibold">
						Résolution
					</h3>
					<button
						v-show="solutions<5"
						class="btn px-2 py-1"
						@click="solutions++"
					>
						Etape suivante
					</button>
				</div>
				
				<ol class="list-decimal list-space space-y-4">
					<li v-show="solutions>0">
						<span v-katex.boxed="'\\sqrt{8x+17} = 0\\implies 8x+17=0 \\implies x = -\\dfrac{17}{8}'" />
					</li>
					
					<li v-show="solutions>1">
						<span v-katex.boxed="'2x-1 = 0 \\implies x = \\dfrac{1}{2}'" />
					</li>
					<li v-show="solutions>2">
						Résolution de l'équation \(2x-1 = \sqrt{8x+17}\) en élevant chaque membre au carré.
						<div
							v-katex.display.left="`
					\\begin{aligned}
					2x-1 &= \\sqrt{8x+17}\\\\
					(2x-1)^2 &= 8x+17\\\\
					4x^2-4x+1 &= 8x+17\\\\
					4x^2-12x-16 &= 0\\\\
					x^2-3x-4 &= 0\\\\
					(x-4)(x+1) &= 0
					\\end{aligned}
					`"
						/>
						
						<div>
							On obtient \(x = -1 \not\in \text{ED}\) et \(x=4 \in \text{ED}\)
						</div>
					</li>
					<li v-show="solutions>3">
						Calculer les intégrales bornées
						<div class="space-y-5">
							<p>
								<span
									v-katex.boxed="'\\displaystyle \\mathcal{A}_1 = \\int_{-17/8}^{4} \\sqrt{8x+17} \\text{d}x =\n'+
										'\t\t\t\t\t\t\t\t\\frac{2}{24}\\sqrt{8x+17}^3 \\Big\\vert_{-17/8}^{4} \\approx 28.58'"
								/>
							</p>
							<p>
								<span
									v-katex.boxed="'\\displaystyle \\mathcal{A}_2 = \\int_{1/2}^{4} 2x-1 \\text{d}x = x^2-x\\Big\\vert_{1/2}^{4} = 12.25'"
								/>
							</p>
						</div>
					</li>
					<li v-show="solutions>4">
						\(\big\vert\mathcal{A}_1\big\vert-\big\vert\mathcal{A}_2\big\vert = 28.58-12.25 \approx 16.33\)
					</li>
				</ol>
			</div>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import ExampleTitle from '@/Components/Ui/ExampleTitle'

const root = ref(null),
	graphBetweenContainer = ref(null),
	solutions = ref(0)

let graphBetween

function loadGraphBetween () {
	graphBetween = new PiDraw(graphBetweenContainer.value, {
		origin: {
			x: 300,
			y: 500
		}
	})
	graphBetween.axis()
	let fx = graphBetween.plot('2*x-1'),
		fxSqrt = graphBetween.plot('sqrt(8*x+17)', {
			domain: {
				min: -17 / 8,
				max: 10
			},
			samples: 20
		})
	
	graphBetween.point(-17 / 8, 0, 'A').asCircle()
	graphBetween.point(0.5, 0, 'B').asCircle()
	graphBetween.point(4, 0, 'C').asCircle()
	graphBetween.point(4, 7, 'D').asCircle()
	
	fxSqrt.fillBetween(false, -17/8, 4)
	fx.fillBetween(false, 0.5, 4).svg.fill('red')
}

onMounted(() => {
	katexAutoRender(root.value)
	
	loadGraphBetween()
})

</script>