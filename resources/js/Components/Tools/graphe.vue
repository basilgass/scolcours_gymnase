<script setup lang="ts">
/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import { computed, ref } from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"

const forms: IToolForm[] = [
	{
		label: "paramètres",
		type: "text",
		value: ref("axis,grid,x=-10:10,y=-10:10"),
		fromUrl: "fonction",
	},
	{
		label: "code",
		type: "code",
		value: ref(""),
	}
]

const params = computed(()=>  forms[0].value.value as string)
const code = computed(()=>  forms[1].value.value as string)

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<pi-draw-parser
			:width="800"
			:height="800"
			:draw="{
				code: code,
				parameters: params
			}"
		/>
	</article>
</template>
