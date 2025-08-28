<script setup lang="ts">
/** Tools
 * title: vecteurs
 * body: calculs avec des vecteurs
 * parameters: v1, v2
 * tags: geometrie,1M,2M,3M
 */
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { numberCorrection } from "@/helpers/helperFunctions.ts"
import { Matrix, Vector } from "pimath"
import { computed, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

// TODO: allow entering 3d vectors.
const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Vecteur 1",
		type: "vector",
		value: ref(""),
		fromUrl: "v1"
	},
	{
		label: "Vecteur 2",
		type: "vector",
		value: ref(""),
		fromUrl: "v2"
	}
])

const v1 = computed(() => forms[0].value.value as string)
const v2 = computed(() => forms[1].value.value as string)

const pV1 = computed<Vector>(() => {
	return new Vector(v1.value)
})
const pV2 = computed<Vector>(() => {
	return new Vector(v2.value)
})

const vectors = computed(() => {
	// Get the list of the vectors, remove the empty ones
	return [pV1.value, pV2.value].filter(v => v.isNull === false)
})

let result = computed(() => {
	if (vectors.value.length === 0) return false

	try {
		return {
			v1: pV1.value,
			v2: pV2.value
		}
	} catch (e) {
		// console.error(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card
			v-if="result"
			class="katex-boxed "
		>
			<div class="grid grid-cols-2 gap-3">
				<div v-katex="`\\overrightarrow{v_1} = ${result.v1.tex}`" />
				<div
					v-if="v2"
					v-katex="`\\overrightarrow{v_2} = ${result.v2.tex}`"
				/>
			</div>

			<h3 class="font-extralight text-xl">
				normes
			</h3>
			<div
				v-if="vectors.length >= 1"
				class="grid grid-cols-2 gap-3"
			>
				<div
					v-if="v1"
					v-katex="`\\overrightarrow{v_1}=\\sqrt{${pV1.normSquare.tex}}=${numberCorrection(pV1.norm)}`"
				/>
				<div
					v-if="v2"
					v-katex="`\\overrightarrow{v_2}=\\sqrt{${pV2.normSquare.tex}}=${numberCorrection(pV2.norm)}`"
				/>
			</div>




			<h3 class="font-extralight text-xl">
				produit scalaire
			</h3>
			<div
				v-if="vectors.length >= 2"
				class="grid grid-cols-2 gap-3"
			>
				<div v-katex="`${pV1.tex} \\cdot ${pV2.tex} = ${pV1.dot(pV2).tex}`" />
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs !
			</div>

			<h3 class="font-extralight text-xl">
				déterminant
			</h3>
			<div
				v-if="vectors.length >= 2"
				class="grid grid-cols-2 gap-3"
			>
				<div
					v-katex="`\\begin{vmatrix} ${pV1.x.tex} & ${pV2.x.tex} \\\\ ${pV1.y.tex} & ${pV2.y.tex} \\end{vmatrix} = ${pV1 && pV2 ? new Matrix().fromVectors(pV1,pV2).determinant().tex : ''}`"
				/>
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs
			</div>

			<h3 class="font-extralight text-xl">
				angle
			</h3>
			<div
				v-if="vectors.length >= 2"
				class="grid grid-cols-2 gap-3"
			>
				<div v-katex="`\\angle \\left(${pV1.tex} ; ${pV2.tex} \\right)  = ${+pV1.angle(pV2).toFixed(2)}`" />
			</div>
			<div
				class="py-1 px-3 bg-red-100 border border-red-300 rounded-sm"
				v-else
			>
				il faut deux vecteurs
			</div>
		</Card>
	</article>
</template>
