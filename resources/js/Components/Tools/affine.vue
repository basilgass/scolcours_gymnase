<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Line, Point, Vector} from "pimath"
/** Tools
 * title: affine
 * body: calcul d'une fonction affine par deux maxPoints
 * parameters: a=Point, b=Point
 * tags: algebre,1M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

// Define the forms
const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
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
])
const A = computed<string>(() => forms[0].value.value as string)
const B = computed<string>(() => forms[1].value.value as string)

function affine() {
	const ptA = new Point(...A.value.split(','))

	const ptB = (B.value[0] === 'v' || B.value[0] === 'n') ?
		new Vector(...B.value.substring(1).split(',')) :
		new Point(...B.value.split(','))

	let line: Line
	if (B.value[0] === 'v') {
		line = new Line().fromPointAndDirection(ptA, ptB)
	} else if (B.value[0] === 'n') {
		line = new Line().fromPointAndNormal(ptA, ptB)
	} else {
		line = new Line().fromPoints(ptA, ptB)
	}

	return {
		equation: line.equation.tex,
		mxh: line.mxh.tex,
		canonical: line.canonical.tex,
		parametric: line.parametric.tex
	}
}

const result = computed(() => {
	try {
		return affine()
	} catch (e) {
		console.warn(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card v-if="result">
			<div>
				<div v-katex="`${result.mxh}`" />
				<div v-katex="`${result.canonical}`" />
				<div v-katex="`${result.equation}`" />
				<div v-katex="`${result.parametric}`" />
			</div>

			<tex-code :tex="`${result.mxh}\n${result.canonical}\n${result.equation}\n${result.parametric}`" />
		</Card>
		<tool-error v-else />
	</article>
</template>
