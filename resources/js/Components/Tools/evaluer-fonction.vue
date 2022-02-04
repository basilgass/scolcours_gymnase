<template>
	<Panel>
		<form-input
			v-model="f"
			label="fonction"
			name="f"
		/>

		<form-input
			v-model="x"
			label="valeur"
			name="x"
		>
			Utiliser un nombre ou une fraction
		</form-input>

		<div v-if="fx">
			<div v-katex="`f\\left(${fx.x.tex}\\right) = ${fx.fx} = ${fx.value}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
		
		<keyboard
			v-model="f"
			keyboard="polynom"
		/>
	</Panel>
</template>

<script setup>
/** Tools
 * title: évaluation d'une fonction polynomiale
 * body: évaluation d'une fonction polynomiale
 * parameters: fx=Fonction (texte), b=Nombre ou Fraction
 * tags: algebre,1M
 */
import Panel from '@/Components/Ui/Panel'
import FormInput from '@/Components/Form/FormInput'
import { computed, ref } from 'vue'
import { Fraction } from 'pimath/esm/maths/coefficients'
import { Polynom } from 'pimath/esm/maths/algebra'
import Keyboard from '@/Components/Ui/Keyboard'

let f = ref('3*x+1'),
	x = ref('1')

let fx = computed(()=>{
	try{
		let fB = new Fraction(x.value),
			FX = new Polynom(f.value)
		
		return {
			F: FX,
			x: fB,
			fx: FX.tex.replace(/x/g, `\\left(${fB.tex}\\right)`),
			value: FX.evaluate(fB).tex
		}
	}catch (e) {
		return false
	}
})
</script>
