<template>
	<section ref="root">
		<Panel type="exercise">
			Soit
			<span v-katex.inline="'(\\Gamma_1): ' + ex1.G1.developed" /> un cercle et
			\(\Gamma_2\) un cercle centré en <span v-katex.inline="'C'+ex1.C2.tex" /> et
			passant par <span v-katex.inline="'T' + ex1.T.tex" />.
			
			<ol class="list-decimal list-inside mt-5 space-y-3">
				<li>Mettre sous forme <span class="italic">centre-rayon</span> les équations des cercles \(\Gamma_1\) et \(\Gamma_2\)</li>
				<li>Calculer l'équation de la tangente \(t\) à \(\Gamma_2\) passant par \(T\) </li>
				<li>Calculer la position relative entre la droite \(t\) et le cercle \(\Gamma_1\)</li>
				<li>Calculer, s'il y en a, le/les point(s) d'intersection entre la droite \(t\) et le cercle \(\Gamma_1\)</li>
				<li>Calculer l'équation cartésienne de la droite \(d\) passant par les deux centres des cercles</li>
				<li>Calculer la médiatrice du sergment reliant les deux sommets</li>
			</ol>
			
			<ol class="list-decimal list-inside mt-5 space-y-3 text-gray-100 hover:text-gray-600 transition-colors">
				<li>
					<div v-katex.left="'(\\Gamma_1): ' + ex1.G1.tex" />
					<div v-katex.left="'(\\Gamma_2): ' + ex1.G2.tex" />
				</li>
				<li>
					<div v-katex.left="'(t): ' + ex1.t.tex.canonical" />
				</li>
				<li>
					La distance vaut <span v-katex.inline="relPositionSign" />
				</li>
				<li>Intersection: pas encore de solution...</li>
				<li>
					<div v-katex.left="'(d): ' + ex1.d.tex.canonical" />
				</li>
				<li>
					<div v-katex.left="'(m): ' + ex1.m.tex.canonical" />
				</li>
			</ol>
			
			<div
					v-if="false"
					class="btn"
					@click="updateEx1(true)"
				>
				RANDOM
			</div>
		</Panel>
	</section>
</template>

<script setup>
/** Chapter
 * title: équation cartésienne d'un cercle
 * body: équation d'un cercle, sous la forme centre-rayon
 */

import { computed, onMounted, ref } from 'vue'
import Panel from '@/Components/Ui/Panel'
import { Circle , Vector, Point, Line} from 'pimath/esm/maths/geometry'
import { Random } from 'pimath/esm/maths/random'
import { Equation } from 'pimath/esm/maths/algebra/equation'

const root = ref(null),
	ex1 = ref({
		C1: new Point(-5,4),
		r1: 36,
		G1: new Circle(),
		C2: new Point(7,-2),
		T: new Point(2,3),
		G2: new Circle(),
		t: new Line(),
		d: new Line(),
		m: new Line(),
		M: new Point(0,0),
		P1: new Point(),
		P2: new Point()
	})

let relPositionSign = computed(()=>{
	const nb = ex1.value.G1.relativePosition(ex1.value.t)
	let sign, text
	
	if(nb===0){
		sign = '>'
		text = 'externe'
	}
	else if(nb===1){
		sign = '='
		text = 'tangent'
	}
	else{
		sign = '<'
		text = 'sécant'
	}
	
	return `${ex1.value.t.distanceTo(ex1.value.G1.center).tex}${ sign }${ex1.value.G1.radius.tex}\\implies \\text{${text}}`
})
function updateEx1(random) {
	// On calcul le cercle Gamma2 et la tangente
	if(random===true){
		ex1.value.C2.parse(Random.numberSym(5,true), Random.numberSym(5,true))
		ex1.value.T.parse(Random.numberSym(5,true), Random.numberSym(5,true))
	}
	ex1.value.G2.parse(ex1.value.C2, ex1.value.T)
	ex1.value.t.parse(new Vector(ex1.value.C2, ex1.value.T), ex1.value.T)
	
	// On calcul le cercle Gamma1 pour que l'intersection avec la tangente donne des coordonnées fractionnaires, sans racine.
	if(random===true){
		ex1.value.C1.parse(Random.numberSym(5,true), Random.numberSym(5,true))
		
		let x = Random.numberSym(5, true),
			y = false,
			P = new Point()
		
		let equ = ex1.value.t.equation.clone().isolate('y')
		if(equ instanceof Equation){
			y = equ.right.evaluate({x: x})
		}
		
		// Calcul de la distance entre le centre et le point fictif.
		// Doit être calculé pour obenir des intersections entières !
		ex1.value.r1 = (new Vector(ex1.value.C1, new Point(x, y))).normSquare
	}
	ex1.value.G1.parse(ex1.value.C1, ex1.value.r1, true)
	
	// -------------------------------
	// Calculs sans aléatoire
	ex1.value.d.parse(ex1.value.G1.center, ex1.value.G2.center)
	ex1.value.M.parse(
		ex1.value.G1.center.x.clone().add(ex1.value.G2.center.x).divide(2),
		ex1.value.G1.center.y.clone().add(ex1.value.G2.center.y).divide(2),
	)
	ex1.value.m.parseByPointAndLine(ex1.value.M, ex1.value.d, Line.PERPENDICULAR)
	
	
	// Calcul des points d'intersections
	// const equ = ex1.value.G1.cartesian.clone(),
	// 	yLine = ex1.value.t.equation.clone().isolate('y')
	//
	//
	// if(yLine instanceof Equation && equ instanceof Equation){
	// 	equ.replaceBy('y', yLine.right).simplify()
	// 	equ.solve()
	// }
}

// Load the function
updateEx1()


// When loaded - auto katex
onMounted(() => {
	katexAutoRender(root.value)
})

</script>

