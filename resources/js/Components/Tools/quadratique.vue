<template>
	<Panel>
		<form-input
			v-model="A"
			label="Coordonnées du point A"
			name="fonction"
			focus
		/>

		<form-input
			v-model="B"
			:label="C===''?'Coordonnées du sommet S':'Coordonnées du point B'"
			name="fonction"
		/>

		<form-input
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

<script setup>
/** Tools
 * title: quadratique
 * body: calcul d'une fonction quadratique
 * parameters: a=Point, b=Point, c=Point (optionnel)
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {Equation, Polynom} from "pimath/esm/maths/algebra"
import {Point} from "pimath/esm/maths/geometry"

let A = ref("1,4"),
	B = ref("2,3"),
	C = ref("5,8")
let result = computed(() => {
	try {
		let P = new Equation("y = a*x^2+b*x+c"),
			pA = new Point(A.value),
			pB = new Point(B.value),
			pC = new Point(C.value)

		// TODO: améliorer le calcul et inclure dans PI
		// y=ax^2+bx+c
		let Pc = P.clone()
				.replaceBy("x", new Polynom(pA.x.display))
				.replaceBy("y", new Polynom(pA.y.display))
				.isolate("c"),
			Pb = P.clone()
				.replaceBy("x", new Polynom(pB.x.display))
				.replaceBy("y", new Polynom(pB.y.display))
				.replaceBy("c", Pc.right)
				.isolate("b"),
			Pa

		if (C.value !== "") {
			Pa = P.clone()
				.replaceBy("x", new Polynom(pC.x.display))
				.replaceBy("y", new Polynom(pC.y.display))
				.replaceBy("c", Pc.right)
				.replaceBy("b", Pb.right)
				.isolate("a")
		} else {
			// Le point B est un sommet !
			// x = -b/2a => b = -2ax
			Pa = new Equation("b = -2a*x")
				.replaceBy("x", new Polynom(pC.x.display))

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
