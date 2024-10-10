<script lang="ts" setup>
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Line, Point, Vector } from "pimath"
/** Tools
 * title: affine
 * body: calcul d'une fonction affine par deux maxPoints
 * parameters: a=Point, b=Point
 * tags: algebre,1M
 */
import { computed, ref } from "vue"

// Define the forms
const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool( [
	{
		label: "point A",
		type: "text",
		value: ref("3,4"),
		fromUrl: "A",
		message: "Utiliser `a,b` pour les coordonnées d'un point",
	},
	{
		label: computed(() => B.value[0] === "v" ? "vecteur directeur" : "point B"),
		type: "text",
		value: ref("1,2"),
		fromUrl: "B",
		message: "Utiliser `a,b` pour les coordonnées d'un point ou `va,b` pour un vecteur directeur ou `na,b` pour un vecteur normal.",
	}
] )
const A = computed<string>(() => forms[0].value.value as string)
const B = computed<string>(() => forms[1].value.value as string)

const affine = computed(() => {
	const ptA = new Point(...A.value.split(','))

	const ptB = (B.value[0] === 'v' || B.value[0] === 'n') ?
		new Vector(...B.value.substring(1).split(',')):
		new Point(...B.value.split(','))

	let line: Line
	if(B.value[0]==='v'){
		line = new Line().fromPointAndDirection(ptA, ptB)
	}else if(B.value[0]==='n'){
		line = new Line().fromPointAndNormal(ptA, ptB)
	}else{
		line = new Line().fromPoints(ptA, ptB)
	}

	try {
		return {
			equation: line.equation.tex,
			mxh: line.mxh.tex,
			canonical: line.canonical.tex,
			parametric: line.parametric.tex
		}
	} catch (e) {
		console.log(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<div v-if="affine">
			<div>
				<div v-katex="`${affine.mxh}`" />
				<div v-katex="`${affine.canonical}`" />
				<div v-katex="`${affine.equation}`" />
				<div v-katex="`${affine.parametric}`" />
			</div>

			<tex-code :tex="`${affine.mxh}\n${affine.canonical}\n${affine.equation}\n${affine.parametric}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-xs"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>
	</article>
</template>
