<template>
	<section ref="root">
		<Panel type="exercise">
			Soit
			<span v-katex.inline="'(\\Gamma_1): ' + ex1.G1.developed" /> un cercle et
			\(\Gamma_2\) un cercle centré en <span v-katex.inline="'C_2'+ex1.C2.tex" /> et
			passant par <span v-katex.inline="'T' + ex1.T.tex" />.

			<ol class="list-decimal list-space mt-5 space-y-3">
				<li>
					Mettre sous forme <span class="italic">centre-rayon</span> les équations des cercles \(\Gamma_1\) et
					\(\Gamma_2\)
				</li>
				<li>Calculer l'équation de la tangente \(t\) à \(\Gamma_2\) passant par \(T\)</li>
				<li>Calculer la position relative entre la droite \(t\) et le cercle \(\Gamma_1\)</li>
				<li>
					Calculer, s'il y en a, le/les point(s) d'intersection entre la droite \(t\) et le cercle
					\(\Gamma_1\)
				</li>
				<li>Calculer l'équation cartésienne de la droite \(d\) passant par les deux centres des cercles</li>
				<li>Calculer la médiatrice du segment reliant les deux sommets</li>
			</ol>

			<ol class="list-decimal list-space mt-5 space-y-3 text-gray-100 hover:text-gray-600 transition-colors">
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
				<li>
					Intersection:
					<div
						v-if="ex1.P1!==false"
						v-katex.left="`P_1${ex1.P1.tex}`"
					/>
					<div
						v-if="ex1.P2!==false"
						v-katex.left="`P_2${ex1.P2.tex}`"
					/>
				</li>
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

import {computed, onMounted, ref} from "vue"
import Panel from "@/Components/Ui/Panel"
import {PiMath} from "pimath/esm";

let root = ref(null),
	ex1 = ref({
		C1: new PiMath.Geometry.Point(-5, 4),
		r1: 36,
		G1: new PiMath.Geometry.Circle(),
		C2: new PiMath.Geometry.Point(7, -2),
		T: new PiMath.Geometry.Point(2, 3),
		G2: new PiMath.Geometry.Circle(),
		t: new PiMath.Geometry.Line(),
		d: new PiMath.Geometry.Line(),
		m: new PiMath.Geometry.Line(),
		M: new PiMath.Geometry.Point(0, 0),
		P1: new PiMath.Geometry.Point(),
		P2: new PiMath.Geometry.Point()
	}),
	count = ref(0)

let relPositionSign = computed(() => {
	const nb = ex1.value.G1.relativePosition(ex1.value.t)
	let sign, text

	if (nb === 0) {
		sign = ">"
		text = "externe"
	} else if (nb === 1) {
		sign = "="
		text = "tangent"
	} else {
		sign = "<"
		text = "sécant"
	}

	return `${ex1.value.t.distanceTo(ex1.value.G1.center).tex}${sign}${ex1.value.G1.radius.tex}\\implies \\text{${text}}`
})

function updateEx1 (random) {
	count.value = 0
	updateEx1Rnd()
}

function updateEx1Rnd () {
	let position, P1, P2, M, t, Tx, T, perp1, perp2, C1x, C1, C2x, C2, r1, r2

	const nb = 20
	position = PiMath.Random.number(0, 2)
	if(position===2) {
		P1 = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)
		P2 = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)

		// On s'assure que les deux points ne sont pas de même coordonnées
		// On impose (artificiellement), que la coordonnées x doit être différente
		while(P2.x.isEqual(P1.x)){
			P2 =new PiMath.Geometry.Point(
				PiMath.Random.numberSym(nb, true),
				PiMath.Random.numberSym(nb, true)
			)
		}

		// On calcule ce qui sera la tangente.
		t = new PiMath.Geometry.Line(P1, P2).simplify()

		// On prend un point aléatoire sur cette tangente.
		Tx = PiMath.Random.numberSym(nb, true)
		T = new PiMath.Geometry.Point(Tx, t.getValueAtX(Tx))

		// Le point T ne doit pas être une des coordonnées P1, P2 (impossible), ni entre P1 et P2
		while(T.x.value>=Math.min(P1.x.value, P2.x.value) && T.x.value<=Math.max(P1.x.value, P2.x.value)){
			Tx = PiMath.Random.numberSym(nb, true)
			T = new PiMath.Geometry.Point(Tx, t.getValueAtX(Tx))
		}

		// On recheche la droite
		M = new PiMath.Geometry.Point().middleOf(P1, P2)
		perp1 = new PiMath.Geometry.Line().parseByPointAndNormal(M, t.director)
		C1x = PiMath.Random.numberSym(nb, true)
		C1 = new PiMath.Geometry.Point(C1x, perp1.getValueAtX(C1x))
		r1 = new Vector(C1, P1).normSquare

		perp2 = new PiMath.Geometry.Line().parseByPointAndNormal(T, t.director)
		C2x = PiMath.Random.numberSym(nb, true)
		C2 = new PiMath.Geometry.Point(C2x, perp2.getValueAtX(C1x))
		r2 = new Vector(C2, T).normSquare
	}
	else if(position===1) {
		P1 = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)
		P2 = false
		T = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)
		// La point T et P1 ne doivent pas être identique.
		while(T.x.isEqual(P1.x) && T.y.isEqual(P1.y)){
			T =new PiMath.Geometry.Point(
				PiMath.Random.numberSym(nb, true),
				PiMath.Random.numberSym(nb, true)
			)
		}

		// On calcule ce qui sera la tangente.
		t = new PiMath.Geometry.Line(P1, T).simplify()


		// On recheche la droite
		perp1 = new PiMath.Geometry.Line().parseByPointAndNormal(P1, t.director)
		C1x = PiMath.Random.numberSym(nb, true)
		C1 = new PiMath.Geometry.Point(C1x, perp1.getValueAtX(C1x))
		r1 = new Vector(C1, P1).normSquare

		perp2 = new PiMath.Geometry.Line().parseByPointAndNormal(T, t.director)
		C2x = PiMath.Random.numberSym(nb, true)
		C2 = new PiMath.Geometry.Point(C2x, perp2.getValueAtX(C1x))
		r2 = new Vector(C2, T).normSquare
	}
	else{
		P1 = false
		P2 = false
		T = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)
		C2 = new PiMath.Geometry.Point(
			PiMath.Random.numberSym(nb, true),
			PiMath.Random.numberSym(nb, true)
		)

		// Le point de tangence ne peut pas être sur le centre
		while(T.x.isEqual(C2.x)){
			T =new PiMath.Geometry.Point(
				PiMath.Random.numberSym(nb, true),
				PiMath.Random.numberSym(nb, true)
			)
		}

		let vecteurRadius = new Vector(T, C2),
			rayon = vecteurRadius.norm
		t = new PiMath.Geometry.Line(T, vecteurRadius, PiMath.Geometry.Line.PERPENDICULAR)

		// On recheche la droite
		let Kx = PiMath.Random.numberSym(nb, true),
			K = new PiMath.Geometry.Point(Kx, t.getValueAtX(Kx))
		// Le point de tangence ne peut pas être sur le centre
		while(K.x.isEqual(T.x)){
			Kx = PiMath.Random.numberSym(nb, true)
			K = new PiMath.Geometry.Point(Kx, t.getValueAtX(Kx))
		}


		perp1 = new PiMath.Geometry.Line().parseByPointAndNormal(K, t.director)
		C1x = PiMath.Random.numberSym(nb, true)
		C1 = new PiMath.Geometry.Point(C1x, perp1.getValueAtX(C1x))
		r1 = Math.round(t.distanceTo(C1).value*0.8)
		while(r1 >= rayon){
			C1x = PiMath.Random.numberSym(nb, true)
			C1 = new PiMath.Geometry.Point(C1x, perp1.getValueAtX(C1x))
			r1 = Math.round(t.distanceTo(C1).value*0.8)
		}

		r2 = new Vector(C2, T).normSquare
	}

	// Points à valeurs entières : C1, C2, T
	if (
		(C1.x.isNatural() && C1.y.isNatural() &&
			C2.x.isNatural() && C2.y.isNatural() &&
			T.x.isNatural() && T.y.isNatural()) || count.value > 20
	) {
		ex1.value.C1 = C1
		ex1.value.r1 = r1
		ex1.value.G1 = new PiMath.Geometry.Circle(C1, r1, true)

		ex1.value.C2 = C2
		ex1.value.T = T
		ex1.value.G2 = new PiMath.Geometry.Circle(C2, r2, true)

		ex1.value.t = t

		ex1.value.d = new PiMath.Geometry.Line(C1, C2)

		ex1.value.m = new PiMath.Geometry.Line().parseByPointAndNormal(new PiMath.Geometry.Point().middleOf(C1, C2), ex1.value.d.director)

		ex1.value.P1 = P1
		ex1.value.P2 = P2
	} else {
		count.value++
		updateEx1Rnd()
	}

}

// Load the function
updateEx1()

// When loaded - auto katex
onMounted(() => {
	katexAutoRender(root.value)
})

</script>

