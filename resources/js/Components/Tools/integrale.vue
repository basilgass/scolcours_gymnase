<template>
	<Panel>
		<form-input
				v-model="fx"
				label="fonction"
				name="fonction"
			/>
		<form-number
				v-model.number="a"
				label="borne inférieure"
				name="a"
			/>
		<form-number
				v-model.number="b"
				label="borne supérieure"
				name="b"
			/>

		<div v-katex="primitive" />
		<p
				class="text-center text-sm font-extralight text-gray-400"
				v-text="primitive"
			/>
	</Panel>
</template>

<script setup>
/** Tools
 * title: intégrale entre deux bornes
 * description: calcul d'intégrale entre deux bornes
 * parameters: fx=Polynom, a=Fraction, b=Fraction
 * tags: algebre,3M
 */
	import Panel from "@/Components/Ui/Panel"
	import FormInput from "@/Components/Form/FormInput"
	import { computed, ref } from "vue"
	import FormNumber from "@/Components/Form/FormNumber"
	import { Polynom } from "pimath/esm/maths/algebra"

	let fx = ref(""),
		a = ref(0),
		b = ref(5)

	let primitive = computed(()=> {
		if(fx.value===""){return "\\text{Aucune fonction...}"}
		let P = new Polynom(fx.value).primitive(),
			Pa = P.evaluate({x: a.value}),
			Pb = P.evaluate({x: b.value})
		return`\\int_{${a.value}}^{${b.value}} ${fx.value} \\ dx
		= \\left. ${P.tex}\\right\\vert_{${a.value}}^{${b.value}}
		= ${Pb.frac} - ${Pa.tex} = ${Pb.subtract(Pa).tex}`
	})
</script>

