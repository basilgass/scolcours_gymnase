<script lang="ts" setup>
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"
import { Circle, Point } from "pimath"
/** Tools
 * title: tangente à un cercle
 * body: calcul de la / les tangente(s) à un cercle passant par un point ou ayant une pente donnée
 * parameters: equ=equation, valeur=Point/Fraction
 * tags: geometrie,3M
 */

// BUG : ne fonctionne pas avec une pente.
import { computed, ref } from "vue"
import Card from "@/Components/Ui/Card.vue"

const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool([
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
])

const equ = computed(()=>forms[0].value.value as string)
const p = computed(()=>forms[1].value.value as string)

let tangentes = computed(() => {
	try {
		const C = new Circle(equ.value)
		const P = new Point(p.value)
		return C.tangents(P)
	} catch (e) {
		console.log(e)
		return false
	}
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card v-if="tangentes">
			<div
				v-for="(tangente, index) of tangentes"
				:key="'tangente-'+index"
			>
				<div v-katex.boxed.lg="`${tangente.tex}`" />

				<tex-code :tex="tangente.tex" />
			</div>
		</Card>

		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite lors de l'introduction des coordonnées.
		</div>

		<div />
	</article>
</template>
