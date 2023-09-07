<template>
	<Panel>
		<form-input
			v-model="polynom"
			label="polynôme"
			name="polynom"
		/>

		<div v-if="result">
			<div v-katex="`${result.tex}`" />
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
 * title: factorisation d'un polynôme
 * body: factorisation d'un polynôme
 * parameters: polynome
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import FormInput from "@/Components/Form/FormInput.vue"
import {computed, ref} from "vue"
import {PiMath} from "pimath/esm"

let polynom = ref("")
let result = computed(() => {
	try {
		let P = new PiMath.Polynom(polynom.value)
		P.factorize()

		return {
			tex: P.texFactors
		}
	} catch (e) {
		// console.error(e)
		return false
	}
})
</script>
