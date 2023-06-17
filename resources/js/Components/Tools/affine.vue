<template>
	<Panel>
		<form-input
			v-model="A"
			focus
			label="Point A"
			name="A"
		>
			Utiliser <code class="px-2 bg-gray-200">a,b</code> pour les coordonnées d'un point
		</form-input>

		<form-input
			v-model="B"
			:label="B[0]==='v'?'Vecteur directeur':'Point B'"
			name="B"
		>
			Utiliser <code class="px-2 bg-gray-200">a,b</code> pour les coordonnées d'un point ou <code
				class="px-2 bg-gray-200"
			>va,b</code> pour un vecteur directeur
		</form-input>

		<div v-if="affine">
			<div>
				<div v-katex="`${affine.mxh}`" />
				<div v-katex="`${affine.canonical}`" />
				<div v-katex="`${affine.equation}`" />
				<div v-katex="`${affine.parametric}`" />
			</div>
			<div class="bg-gray-100 border-gray-300 rounded font-code px-3 py-1">
				<div v-text="`${affine.mxh}`" />
				<div v-text="`${affine.canonical}`" />
				<div v-text="`${affine.equation}`" />
				<div v-text="`${affine.parametric}`" />
			</div>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
	</Panel>
</template>

<script setup>
/** Tools
 * title: affine
 * body: calcul d'une fonction affine par deux maxPoints
 * parameters: a=Point, b=Point
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"

let A = ref("3,4"),
	B = ref("1,2")


let affine = computed(() => {
	try {
		return new PiMath.Geometry.Line(
			new PiMath.Geometry.Point(A.value),
			B.value[0] === "v" ? new PiMath.Geometry.Vector(B.value.substring(1)) : new PiMath.Geometry.Point(B.value)
		).tex
	} catch (e) {
		return false
	}
})
</script>
