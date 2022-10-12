<template>
	<Panel>
		<form-input
			v-model="params"
			label="paramètres"
			name="params"
		/>
		<form-textarea
			v-model="code"
			label="code"
			name="code"
			focus
		/>

		<pi-draw-parser
			:draw="{
				code: code,
				parameters: params
			}"
		/>
	</Panel>
</template>

<script setup>
/** Tools
 * title: graphe
 * body: affichage d'un graphique
 * parameters: fonction à tracer.
 * tags: algebre,1M
 */
import Panel from "@/Components/Ui/Panel"
import {ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import FormInput from "@/Components/Form/FormInput.vue"

let code = ref(""),
	params = ref("axis,grid,x=-10:10,y=-10:10")
</script>
