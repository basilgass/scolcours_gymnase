<script setup lang="ts">
/** Tools
 * title: intégrale entre deux bornes
 * body: calcul d'intégrale entre deux bornes
 * parameters: fx=Polynom, a=Fraction, b=Fraction
 * tags: algebre,3M
 */
import { computed, ref } from "vue"
import { PiMath } from "pimath"
import FormMaker from "@/Components/Form/FormMaker.vue"
import type { Fraction } from "pimath/dist/maths/coefficients/fraction"

const fx = ref(""),
	a = ref(0),
	b = ref(5)

const result = computed(() => {
	try {
		if (fx.value === "") {
			return "\\text{Aucune fonction...}"
		}
		const p = new PiMath.Polynom(fx.value),
			P = p.clone().primitive(),
			Pa = P.evaluate({x: a.value as unknown as Fraction}),
			Pb = P.evaluate({x: b.value as unknown as Fraction})

		return `\\int_{${a.value}}^{${b.value}} ${p.tex} \\ dx
		= \\left. ${P.tex}\\right\\vert_{${a.value}}^{${b.value}}
		= ${Pb.frac} - ${Pa.tex} = ${Pb.clone().subtract(Pa).tex} = ${Pb.subtract(Pa).value}`
	} catch (e) {
		console.error(e)
		return false
	}
})
</script>

<template>
	<article>
		<form-maker
			v-model="fx"
			label="fonction"
			from-url="fx"
			focus
		/>
		<form-maker
			v-model="a"
			type="fraction"
			label="borne inférieure"
			from-url="a"
		/>
		<form-maker
			type="fraction"
			v-model="b"
			label="borne supérieure"
			from-url="b"
		/>

		<div v-if="result">
			<div
				v-katex="result"
				class="katex-boxed"
			/>
			<p
				class="text-center text-sm font-extralight text-gray-400"
				v-text="result"
			/>
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</article>
</template>

