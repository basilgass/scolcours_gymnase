<script setup>
/** Tools
 * title: quadratique
 * body: calcul d'une fonction quadratique
 * parameters: a=Point, b=Point, c=Point (optionnel)
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath/esm"
import FormMaker from "@/Components/Form/FormMaker.vue"

let A = ref("-2,-11"),
	B = ref("0,-7"),
	C = ref("-4,-7")
let result = computed(() => {

	let poly = new PiMath.Polynom('ax^2+bx+c')

	try {
		let P = new PiMath.Equation("y", "ax^2+bx+c"),
			pA = new PiMath.Geometry.Point(A.value),
			pB = new PiMath.Geometry.Point(B.value),
			pC = new PiMath.Geometry.Point(C.value)

		// TODO: améliorer le calcul et inclure dans PI
		// y=ax^2+bx+c
		// console.log(P.display)
		let Pc = P.clone()
				.replaceBy("x", new PiMath.Polynom(pA.x.display))
				.replaceBy("y", new PiMath.Polynom(pA.y.display))
				.isolate("c"),
			Pb = P.clone()
				.replaceBy("x", new PiMath.Polynom(pB.x.display))
				.replaceBy("y", new PiMath.Polynom(pB.y.display))
				.replaceBy("c", Pc.right)
				.isolate("b"),
			Pa

		// console.log(Pc.tex)
		// console.log(Pb.tex)
		if (C.value !== "") {
			Pa = P.clone()
				.replaceBy("x", new PiMath.Polynom(pC.x.display))
				.replaceBy("y", new PiMath.Polynom(pC.y.display))
				.replaceBy("c", Pc.right)
				.replaceBy("b", Pb.right)
				.isolate("a")
		} else {
			// Le point B est un sommet !
			// x = -b/2a => b = -2ax
			Pa = new PiMath.Equation("b = -2a*x")
				.replaceBy("x", new PiMath.Polynom(pC.x.display))

			Pa.left = Pb.right.clone()
			Pa.isolate("a")
		}

		Pb = Pb.replaceBy("a", Pa.right)
		Pc = Pc.replaceBy("b", Pb.right).replaceBy("a", Pa.right)

		return P.clone()
			.replaceBy("a", Pa.right)
			.replaceBy("b", Pb.right)
			.replaceBy("c", Pc.right)
	}catch(e){
		console.error(e)
		return false
	}
})
</script>

<template>
	<Panel>
		<form-maker
			v-model="A"
			label="Coordonnées du point A"
			name="fonction"
			focus
		/>

		<form-maker
			v-model="B"
			:label="C===''?'Coordonnées du sommet S':'Coordonnées du point B'"
			name="fonction"
		/>

		<form-maker
			v-model="C"
			label="Coordonnées du point C"
			name="fonction"
		/>

		<div v-if="result">
			<div v-katex="`${result.tex}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>
