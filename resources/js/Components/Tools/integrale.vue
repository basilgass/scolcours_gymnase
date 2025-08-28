<script setup lang="ts">
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Fraction, Polynom } from "pimath"

/** Tools
 * title: intégrale entre deux bornes
 * body: calcul d'intégrale entre deux bornes
 * parameters: fx=Polynom, a=Fraction, b=Fraction
 * tags: algebre,3M
 */
import { computed, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool( [
	{
		label: "fonction",
		type: "text",
		value: ref(""),
		fromUrl: "fx"
	},
	{
		label: "borne inférieure",
		type: "fraction",
		value: ref(0),
		fromUrl: "a"
	},
	{
		label: "borne supérieure",
		type: "fraction",
		value: ref(5),
		fromUrl: "b"
	}
] )

const fx = computed(()=>forms[0].value.value as string)
const a = computed(()=>forms[1].value.value as string)
const b = computed(()=>forms[2].value.value as string)

const result = computed(() => {
	try {
		if (fx.value === "") {
			return "\\text{Aucune fonction...}"
		}
		const p = new Polynom(fx.value),
			P = p.clone().primitive(),
			Pa: Fraction = P.evaluate({x: a.value as unknown as Fraction}) as Fraction,
			Pb: Fraction = P.evaluate({x: b.value as unknown as Fraction}) as Fraction

		return `\\int_{${a.value}}^{${b.value}} ${p.tex} \\ dx
		= \\left[ ${P.tex}\\right]_{${a.value}}^{${b.value}}
		= ${Pb.tex} - ${Pa.tex} = ${Pb.clone().subtract(Pa).tex} = ${Pb.subtract(Pa).value}`
	} catch (e) {
		console.error(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card v-if="result">
			<div
				v-katex="result"
				class="katex-boxed"
			/>
			<tex-code :tex="result" />
		</Card>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>

