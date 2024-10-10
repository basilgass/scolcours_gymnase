<script lang="ts" setup>
import PiEuclidian from "@/Components/Pi/PiEuclidian.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { useToolsStorage } from "@/Composables/useToolsStorage.ts"

/** Tools
 * title: division de polynômes
 * body: division euclidienne avec des polynômes je fais des modifications.
 * parameters: numerator=Polynom, denominator=Polynom
 * tags: algebre,1M
 */
import { computed, ref } from "vue"

// Define the forms
const { restoreTool } = useToolsStorage()
const forms: IToolForm[] = restoreTool( [
	{
		label: "numérateur",
		type: "text",
		value: ref("3x^2-4"),
		fromUrl: "n"
	},
	{
		label: "dénominateur",
		type: "text",
		value: ref("x-5"),
		fromUrl: "d"
	}
] )

const numerator = computed(() => forms[0].value.value)
const denominator = computed(() => forms[1].value.value)

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<pi-euclidian
			:fx="`${numerator}/${denominator}`"
			asymptote
			fundamental
		/>
	</article>
</template>
