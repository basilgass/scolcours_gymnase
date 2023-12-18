<script setup>

import { ref } from "vue"
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

let treeData = ref("A,3,P,5,3"),
	treeParams = ref("")

</script>
<template>
	<article>
		<form-maker
			v-model="treeParams"
			class="font-code"
			label="paramètres"
			message="R=[p|f|v]/[digits],B=[p|f|v]/[digits]"
		/>
		<form-maker
			type="textarea"
			v-model="treeData"
			:rows="10"
			class="font-code"
			label="tree data"
			name="tree"
		/>
		<pi-probability-tree
			:tree-data="treeData"
			:tree-params="treeParams"
		/>
	</article>
</template>
