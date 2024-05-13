<script setup lang="ts">
/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import { ref } from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

const code = ref(""),
	params = ref("axis,grid,x=-10:10,y=-10:10")
</script>

<template>
	<article>
		<form-maker
			v-model="params"
			label="paramètres"
			from-url="param"
		/>
		<form-maker
			type="textarea"
			v-model="code"
			label="code"
			from-url="code"
			focus
		/>

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
