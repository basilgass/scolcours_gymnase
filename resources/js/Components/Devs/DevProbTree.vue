<template>
	<article>
		<form-textarea
			v-model="treeData"
			:rows="10"
			class="font-code"
			label="tree data"
			name="tree"
		/>
		<pi-probability-tree :tree-data="treeData" />
	</article>
</template>
<script setup>

import {ref} from "vue"
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import FormTextarea from "@/Components/Form/FormTextarea.vue"

let treeData = ref("A,3,P,5,3")

</script>
