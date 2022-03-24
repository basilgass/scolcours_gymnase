<template>
	<Panel>
		<form-input
			v-model="polynom"
			label="Polynôme"
			name="polynom"
			focus
		/>

		<div v-if="result">
			<div
				v-katex.display.boxed.lg="`${result.tex}`"
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
 * title: développement de polynôme
 * body: permet de développer un polynôme plus ou moins complexe.
 * parameters: polynôme
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel"
import FormInput from "@/Components/Form/FormInput"
import {computed, ref} from "vue"
import {Polynom} from "pimath/esm/maths/algebra"

let polynom = ref(""),
	firstInput = ref(null)

let result = computed(() => {
	try {
		if (polynom.value === "") {
			return "\\text{Aucune fonction...}"
		}
		const P = new Polynom(polynom.value)

		return {
			tex: P.tex
		}
	} catch (e) {
		console.error(e)
		return false
	}
})

</script>
