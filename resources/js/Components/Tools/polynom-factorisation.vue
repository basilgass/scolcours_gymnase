<script setup lang="ts">
/** Tools
 * title: factorisation d'un polynôme
 * body: factorisation d'un polynôme
 * parameters: polynome
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import  PiMath from "pimath"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"

const forms: IToolForm[] = [
	{
		label: "Polynôme",
		type: "text",
		value: ref(""),
		fromUrl: "p"
	}
]

const polynom = computed(() => forms[0].value.value as string)

let result = computed(() => {
	try {
		let P = new PiMath.Polynom(polynom.value)
		P.factorize()

		return {
			tex: P.tex + ' = ' + P.texFactors
		}
	} catch (e) {
		// console.error(e)
		return {
			tex: '\\text{ le polynôme n\'est pas reconnu.}'
		}
	}
})

function updateKbrd(event){
	forms[0].value.value=event.input
}
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<div v-if="result">
			<div v-katex.display.boxed.lg="`${result.tex}`" />

			<tex-code :tex="result.tex" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>


		<keyboard-display
			class="mt-3"
			back
			keyboard="polynom"
			next
			reset
			@change="updateKbrd"
		/>
	</article>
</template>
