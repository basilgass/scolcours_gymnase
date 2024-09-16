<script lang="ts" setup>
/** Tools
 * title: développement de polynôme
 * body: permet de développer un polynôme plus ou moins complexe.
 * parameters: polynôme
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import  PiMath from "pimath"
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"

const forms: IToolForm[] = [
	{
		label: "Polynôme",
		type: "text",
		value: ref(""),
		fromUrl: "p"
	}
]

const polynom = computed(() => forms[0].value.value as string)

const result = computed(() => {
	try {
		if (polynom.value === "") {
			return { tex: "\\text{Aucune fonction...}" }
		}
		const P = new PiMath.Polynom(polynom.value)

		return {
			tex: P.tex
		}
	} catch (e) {
		return {
			tex: "\\text{ le polynôme n'est pas reconnu.}"
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
