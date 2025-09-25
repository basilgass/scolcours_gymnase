<script setup lang="ts">

import PiMarkovGraph from "@/Components/Pi/PiDrawComponents/PiMarkovGraph.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import {computed, ref} from "vue"
import GrapheDeMarkov from "@/Components/Widgets/algebre/graphe-de-markov.vue"


const labelInput = ref(`A,B,C`)
const matrixInput = ref(`0.1 0.2 0.3
1.1 1.2 1.3
2.1 2.2 2.3`)

const nodes = computed(() => {
	const n = labelInput.value.split('\n').length
	if (n < 2 || n > 4) {
		return null
	}
	return n
})


const illustration = computed(()=>{
	return {
		parameters: '',
		code: `${labelInput.value}\n${matrixInput.value}`
	}
})

console.log(illustration.value)
</script>

<template>
	<div>
		<div>
			<form-maker
				type="text"
				class="font-code"
				label="étiquettes"
				v-model="labelInput"
			/>
			<form-maker
				type="textarea"
				class="font-code"
				label="matrice"
				v-model="matrixInput"
				rows="4"
			/>
		</div>

		<graphe-de-markov
			:illustration="{
				parameters: '',
				code: `${labelInput}\n${matrixInput}`
			}"
		/>
	</div>
</template>
