<template>
	<Panel>
		<form-input
			v-model="fx"
			label="fonction"
			name="fonction"
			focus
		/>
		<form-fraction
			v-model="a"
			label="borne inférieure"
			name="a"
		/>
		<form-fraction
			v-model="b"
			label="borne supérieure"
			name="b"
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
	</Panel>
</template>

<script setup>
/** Tools
 * title: intégrale entre deux bornes
 * body: calcul d'intégrale entre deux bornes
 * parameters: fx=Polynom, a=Fraction, b=Fraction
 * tags: algebre,3M
 */
import Panel from "@/Components/Ui/Panel.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"
import FormFraction from "@/Components/Form/FormFraction.vue"

let fx = ref(""),
	a = ref(0),
	b = ref(5)

let result = computed(() => {
	try {
		if (fx.value === "") {
			return "\\text{Aucune fonction...}"
		}
		let p = new PiMath.Polynom(fx.value),
			P = p.clone().primitive(),
			Pa = P.evaluate({x: a.value}),
			Pb = P.evaluate({x: b.value})

		return `\\int_{${a.value}}^{${b.value}} ${p.tex} \\ dx
		= \\left. ${P.tex}\\right\\vert_{${a.value}}^{${b.value}}
		= ${Pb.frac} - ${Pa.tex} = ${Pb.clone().subtract(Pa).tex} = ${Pb.subtract(Pa).value}`
	} catch (e) {
		console.error(e)
		return false
	}
})
</script>

