<!--
Affichage d'un arbre de probabilité
Utilisé avec ProbabilityTree.js
-->
<script setup lang="ts">
import { ProbabilityTree } from "@/ProbabilityTree"
import { onMounted, ref, watch } from "vue"

const props = defineProps({
	treeData: {type: String, required: true},
	treeParams: {type: String, required: true}
})
const root = ref(null),
	tree = ref(null)

let Tree

function updateTree() {
	Tree.update(props.treeData, props.treeParams)
}

onMounted(() => {
	// Tree = new ProbabilityTree(document.getElementById("tree"), props.treeData)
	Tree = new ProbabilityTree(tree.value, props.treeData, props.treeParams)
})

watch(()=>props.treeData, ()=>{
	updateTree()
})

watch(()=>props.treeParams, ()=>{
	updateTree()
})
</script>

<template>
	<div ref="root">
		<div ref="tree" />
	</div>
</template>
