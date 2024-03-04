<script setup lang="ts">
/** Tools
 * title: tangente à un cercle
 * body: calcul de la / les tangente(s) à un cercle passant par un point ou ayant une pente donnée
 * parameters: equ=equation, valeur=Point/Fraction
 * tags: geometrie,3M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath/esm"
import FormMaker from "@/Components/Form/FormMaker.vue"

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

<template>
	<Panel>
		<form-maker
			v-model="equ"
			label="Equation du cercle"
			name="equ"
			focus
			message="Utiliser `a,b` pour les coordonnées d'un point"
		/>

		<form-maker
			v-model="value"
			:label="value.includes(',')?'Point':'Pente'"
			name="value"
			message="Utiliser `a,b` pour les coordonnées d'un point ou `a/b` pour une pente"
		/>

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
