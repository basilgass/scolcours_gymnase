<script setup>
/** Tools
 * title: tangente à un graphe (fonction polynomiale)
 * body: permet de calculer l'équation cartésienne d'une tangente à un graphe à un point d'abscisse donné.
 * parameters: fx=fonction polynomiale, x=abscisse du point de tangence
 * tags: algebre,2M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath/esm"
import FormMaker from "@/Components/Form/FormMaker.vue"

let fx = ref("1/3x^2"),
	x = ref("3")


let affine = computed(() => {
	try{
		let P = new PiMath.Polynom(fx.value),
			a = new PiMath.Fraction(x.value),
			fa = P.evaluate(a),
			dP = P.derivative(),
			m = dP.evaluate(a),
			h = fa.clone().subtract(m.clone().multiply(a))

		return new PiMath.Geometry.Line(`y=${m.display}x+(${h.display})`)
	}catch{
		return false
	}

})
</script>

<template>
	<Panel>
		<form-maker
			v-model="fx"
			label="fonction"
			name="fonction"
			focus
		/>

		<form-maker
			v-model="x"
			label="abscisse du point de tangence"
			name="x"
		/>

		<div v-if="affine">
			<div v-katex="`${affine.tex.mxh}`" />
			<div v-katex="`${affine.tex.canonical}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
	</Panel>
</template>
