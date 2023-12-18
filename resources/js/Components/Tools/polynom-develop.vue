<script setup>
/** Tools
 * title: développement de polynôme
 * body: permet de développer un polynôme plus ou moins complexe.
 * parameters: polynôme
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { computed, ref } from "vue"
import { PiMath } from "pimath/esm"
import FormMaker from "@/Components/Form/FormMaker.vue"

let polynom = ref("")

	let result = computed(() => {
		try {
			if (polynom.value === "") {
				return "\\text{Aucune fonction...}"
			}
			const P = new PiMath.Polynom(polynom.value)

			return {
				tex: P.tex,
			}
		} catch (e) {
			console.error(e)
			return false
		}
	})
</script>

<template>
	<Panel>
		<form-maker
			v-model="polynom"
			label="Polynôme"
			name="polynom"
			focus
		/>

		<div v-if="result">
			<div v-katex.display.boxed.lg.output="`${result.tex}`" />
		</div>
		<div
			v-else
			class="text-red-700 text-sm"
		>
			Une erreur s'est produite avec vos données.
		</div>
	</Panel>
</template>
