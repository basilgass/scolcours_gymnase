<template>
	<!-- Title -->
	<div ref="root">
		<form-textarea
			v-model="treeData"
			name="treeData"
			label="Générateur d'arbre"
			:rows="rows"
		/>
		<pi-probability-tree
			class="max-w-lg"
			:tree-data="treeData"
		/>
	</div>
</template>
<script setup>
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import {computed, ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

let treeData = ref(`A,2
   X,3
   Y,5
      U,2
      V,6
   F,4
B,5`),
	rows = computed(() => {
		return treeData.value.split("\n").length
	})
</script>

