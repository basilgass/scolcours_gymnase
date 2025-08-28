<script setup lang="ts">
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { KbrdEvent } from "@/types"
import { PolyFactor } from "pimath"
/** Tools
 * title: factorisation d'un polynôme
 * body: factorisation d'un polynôme
 * parameters: polynome
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool( [
	{
		label: "Polynôme",
		type: "text",
		value: ref(""),
		fromUrl: "p"
	}
] )

const polynom = computed(() => forms[0].value.value as string)

let result = computed(() => {
	try {
		const P = new PolyFactor().fromPolynom(polynom.value)

		const factorized = P.factorize()
		return {
			tex: P.tex + ' = ' + factorized.tex
		}
	} catch {
		// console.error(e)
		return {
			tex: '\\text{ le polynôme n\'est pas reconnu.}'
		}
	}
})

function updateKbrd(event: KbrdEvent){
	forms[0].value.value=event.input
}
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card>
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
		</Card>
	</article>
</template>
