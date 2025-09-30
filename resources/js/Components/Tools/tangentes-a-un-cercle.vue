<script lang="ts" setup>
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import TexCode from "@/Components/Ui/TexCode.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {Circle, Fraction, Point} from "pimath"
/** Tools
 * title: tangente à un cercle
 * body: calcul de la / les tangente(s) à un cercle passant par un point ou ayant une pente donnée
 * parameters: equ=equation, valeur=Point/Fraction
 * tags: geometrie,3M
 */
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	{
		label: "Equation du cercle",
		type: "text",
		value: ref("(x-4)^2+(y-5)^2=25"),
		fromUrl: "c",
		message: "Utiliser `a,b` pour les coordonnées d'un point"
	},
	{
		label: computed(() => equ.value.includes(',') ? 'Point' : 'Pente'),
		type: "text",
		value: ref("7,9"),
		fromUrl: "p",
		message: "Utiliser `a,b` pour les coordonnées d'un point ou `a/b` pour une pente"
	}
])

const equ = computed(() => forms[0].value.value as string)
const p = computed(() => forms[1].value.value as string)

const circle = computed(() => {
	try {
		return new Circle(equ.value)
	} catch {
		return null
	}
})
const point = computed(() => {
	if (p.value.includes(',')) {
		return new Point(p.value)
	}
	return null
})
const slope = computed(() => {
	try {
		return new Fraction(p.value)
	} catch {
		return null
	}
})
let tangentes = computed(() => {
	if (!circle.value) {
		return false
	}

	if (point.value) {
		return circle.value.tangents(point.value)
	}

	if (slope.value) {
		return circle.value.tangents(slope.value)
	}

	return false

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
		<tool-error v-else />
	</article>
</template>
