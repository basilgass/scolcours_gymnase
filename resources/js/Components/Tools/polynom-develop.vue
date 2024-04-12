<script setup lang="ts">
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
import KeyboardDisplay from "@/Components/Keyboards/KeyboardDisplay.vue"

const polynom = ref("")

	const result = computed(() => {
		try {
			if (polynom.value === "") {
				return { tex: "\\text{Aucune fonction...}" }
			}
			const P = new PiMath.Polynom(polynom.value)

			return {
				tex: P.tex,
			}
		} catch (e) {
			console.error(e)
			return {
				tex: '\\text{ le polynôme n\'est pas reconnu.}'
			}
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

		<div v-katex.display.boxed.lg.output="`${result.tex}`" />

		<keyboard-display
			back
			reset
			next
			keyboard="polynom"
			@change="polynom=$event.input"
		/>
	</Panel>
</template>
