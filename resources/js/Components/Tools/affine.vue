<script lang="ts" setup>
/** Tools
 * title: affine
 * body: calcul d'une fonction affine par deux maxPoints
 * parameters: a=Point, b=Point
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"

// Define the forms
const forms: IToolForm[] = [
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
		message: "Utiliser `a,b` pour les coordonnées d'un point ou `va,b`",
	}
]
const A = computed<string>(() => forms[0].value.value as string)
const B = computed<string>(() => forms[1].value.value as string)


const affine = computed(() => {
	try {
		return new PiMath.Geometry.Line(
			new PiMath.Geometry.Point(A.value),
			B.value[0] === "v" ? new PiMath.Geometry.Vector(B.value.substring(1)) : new PiMath.Geometry.Point(B.value)
		).tex
	} catch (e) {
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
