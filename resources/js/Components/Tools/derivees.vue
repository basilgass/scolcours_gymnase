<script setup lang="ts">
/** Tools
 * title: dérivées
 * body: calcul de la dérivée d'une fonction polynomiale ou rationnelle.
 * parameters: fn=Function
 * tags: algebre,2M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import FormMaker from "@/Components/Form/FormMaker.vue"

let numerator = ref(""),
	denominator = ref("")

let result = computed(() => {
	let  P
	try {

		if(denominator.value.trim()===""){
			P = new PiMath.Polynom(numerator.value).derivative()
		}else{
			P = new PiMath.Rational(numerator.value, denominator.value).derivative()
		}

		// Factorize the polynom / rational
		P.factorize()

		// Compate the tex values (factorized and unfactorized)
		let tex = P.tex, Ftex = P.texFactors

		// Value to display
		return tex===Ftex?tex:`${ tex } = ${ Ftex }`
	}catch(e){
		console.error(e)
		return false
	}
})

function copyToClipboard(){
	navigator.clipboard.writeText(result.value)
}
</script>

<template>
	<Panel>
		<form-maker
			v-model="numerator"
			label="fonction à dériver (numérateur)"
			name="fonction"
			focus
		/>

		<form-maker
			v-model="denominator"
			label="fonction à dériver (dénominateur - optionnel)"
			name="fonction"
		/>


		<div v-if="result">
			<div
				v-if="numerator.trim()!==''"
				v-katex="result"
			/>
			<div class="flex text-xs text-gray-600">
				<button
					class="bi bi-clipboard mr-3"
					@click="copyToClipboard"
				/>
				<div
					class="font-code"
					v-text="result"
				/>
			</div>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>
