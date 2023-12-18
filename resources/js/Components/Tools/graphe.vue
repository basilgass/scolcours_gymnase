<script setup>
/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel.vue"
import { ref } from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let code = ref(""),
	params = ref("axis,grid,x=-10:10,y=-10:10")
</script>

<template>
	<Panel>
		<form-maker
			v-model="params"
			label="paramètres"
			name="params"
		/>
		<form-maker
			type="textarea"
			v-model="code"
			label="code"
			name="code"
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
	</Panel>
</template>
