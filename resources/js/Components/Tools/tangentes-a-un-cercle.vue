<template>
	<Panel>
		<form-input
			v-model="equ"
			label="Equation du cercle"
			name="equ"
			focus
		>
			Utiliser <code class="px-2 bg-gray-200">a,b</code> pour les coordonnées d'un point
		</form-input>

		<form-input
			v-model="value"
			:label="value.includes(',')?'Point':'Pente'"
			name="value"
		>
			Utiliser <code class="px-2 bg-gray-200">a,b</code> pour les coordonnées d'un point ou <code class="px-2 bg-gray-200">a/b</code> pour une pente
		</form-input>

		<div v-if="tangentes">
			<div
				v-for="(tangente,index) of tangentes"
				:key="'tangente-'+index"
				v-katex="`${tangente.tex.canonical}`"
			/>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>

		<div />
	</Panel>
</template>

<script setup>
/** Tools
 * title: tangente à un cercle
 * body: calcul de la / les tangente(s) à un cercle passant par un point ou ayant une pente donnée
 * parameters: equ=equation, valeur=Point/Fraction
 * tags: geometrie,3M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"

let equ = ref("(x-4)^2+(y-5)^2=25"),
	value = ref("7,9")

let tangentes = computed(() => {
	try {
		const C = new PiMath.Geometry.Circle(equ.value)
		const P = new PiMath.Geometry.Point(value.value)
		return C.tangents(P)
	} catch (e) {
		return false
	}
})
</script>
