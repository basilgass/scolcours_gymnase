<script lang="ts" setup>
/** Tools
 * title: tangente à un cercle
 * body: calcul de la / les tangente(s) à un cercle passant par un point ou ayant une pente donnée
 * parameters: equ=equation, valeur=Point/Fraction
 * tags: geometrie,3M
 */
import { computed, ref } from "vue"
import  PiMath from "pimath"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"

const forms: IToolForm[] = [
	{
		label: "Equation du cercle",
		type: "text",
		value: ref("(x-4)^2+(y-5)^2=25"),
		fromUrl: "c",
		message: "Utiliser `a,b` pour les coordonnées d'un point"
	},
	{
		label: computed(() => equ.value.includes(',')?'Point':'Pente'),
		type: "text",
		value: ref("7,9"),
		fromUrl: "p",
		message: "Utiliser `a,b` pour les coordonnées d'un point ou `a/b` pour une pente"
	}
]

const equ = computed(()=>forms[0].value.value as string)
const p = computed(()=>forms[1].value.value as string)

let tangentes = computed(() => {
	try {
		const C = new PiMath.Geometry.Circle(equ.value)
		const P = new PiMath.Geometry.Point(p.value)
		return C.tangents(P)
	} catch (e) {
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<div v-if="tangentes">
			<div
				v-for="(tangente,index) of tangentes"
				:key="'tangente-'+index"
			>
				<div v-katex.boxed.lg="`${tangente.tex.canonical}`" />
				<tex-code :tex="tangente.tex.canonical" />
			</div>
		</div>

		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>

		<div />
	</article>
</template>
