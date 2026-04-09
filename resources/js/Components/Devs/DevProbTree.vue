<script setup lang="ts">

import { ref } from "vue"
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"
import FormInput from "@/Components/Form/FormInput.vue"

const treeData = ref("A,3,P,5,3"),
	treeParams = ref("")

</script>
<template>
	<article>
		<FormInput
			v-model="treeParams"
			class="font-code"
			label="paramètres"
			message="R=[p|f|v]/[digits],B=[p|f|v]/[digits]"
		/>
		<FormTextarea
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
