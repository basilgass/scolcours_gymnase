<script setup lang="ts">
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Factor, PolyFactor, Polynom } from "pimath"
/** Tools
 * title: dérivées
 * body: calcul de la dérivée d'une fonction polynomiale ou rationnelle.
 * parameters: fn=Function
 * tags: algebre,2M
 */
import { computed, ref } from "vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool( [
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
] )

let numerator = computed(()=>forms[0].value.value as string),
	denominator = computed(()=>forms[1].value.value as string)

let result = computed(() => {
	let  P
	try {

		if(denominator.value.trim()===""){
			P = new Polynom(numerator.value).derivative()
		}else{
			P = new PolyFactor(
				new Factor(numerator.value),
				new Factor(denominator.value, -1)
			).derivative().asRoot
		}

		// Factorize the polynom / PolyFactor
		// TODO: Enable factorize !
		// P.factorize()

		// Compate the tex values (factorized and unfactorized)
		// let tex = P.tex

		let tex = P.tex
		// Value to display
		return `${ tex }`
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
