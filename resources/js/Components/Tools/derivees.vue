<script setup lang="ts">
/** Tools
 * title: dérivées
 * body: calcul de la dérivée d'une fonction polynomiale ou rationnelle.
 * parameters: fn=Function
 * tags: algebre,2M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"

const forms: IToolForm[] = [
	{
		label: "fonction à dériver (numérateur)",
		type: "text",
		value: ref(""),
		fromUrl: "n",
	},
	{
		label: "fonction à dériver (dénominateur - optionnel)",
		type: "text",
		value: ref(""),
		fromUrl: "d",
	}
]
let numerator = computed(()=>forms[0].value.value as string),
	denominator = computed(()=>forms[1].value.value as string)

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

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<div v-if="result">
			<div
				v-if="numerator.trim()!==''"
				v-katex="result"
			/>
			<tex-code :tex="result" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>
