<template>
	<div ref="root">
		<div ref="tree" />
	</div>
</template>

<script setup>
import {ProbabilityTree} from "@/ProbabilityTree"
import {onMounted, ref, watch} from "vue"

let props = defineProps({
	treeData: {type: String, required: true}
})
let root = ref(null),
	tree = ref(null)

let Tree

function updateTree() {
	// Build the data.
	// It should accept
	// A,3,P,5,3
	// A,3,[B,4,[C,2,3],C,8],U,9
	if (treeData.value.includes("\n")) {
		// It's an object
		let lines = treeData.value.split("\n"),
			crtLeaves = [],	// Leaves from the current node.
			rootLeaf = {node: "ROOT", value: 0, leaves: []},		// current root node
			branchLeaves = [rootLeaf],	// list of nodes
			crtLevel = 0

		for (let line of lines) {
			let prefix = line.match(/^[\s]*/)[0] || "",
				level = prefix.length / 3,
				sline = line.split(","),
				node = sline[0].trim(),
				value = sline[1] || 0

			// console.log(level, node, value)
			// console.log(rootLeaf?.node)
			// console.log("")

			if (level === crtLevel) {
				// console.log("Same level")
				// console.log(rootLeaf)
				// Same level -> adding to the current root leaf.
				rootLeaf.leaves.push({node, value, leaves: []})
			}else if (level > crtLevel) {
				// console.log("New child")
				// it's a child node..
				crtLevel = +level
				// Add the current root to the list.
				branchLeaves.push(rootLeaf)
				// The new root leaf is the last child of the previous root.
				rootLeaf = rootLeaf.leaves[rootLeaf.leaves.length-1]
				// Add the node
				rootLeaf.leaves.push({node, value, leaves: []})
			} else if (level < crtLevel) {
				// Select the new root.
				for(let i=crtLevel-level; i>0; i--){
					rootLeaf = branchLeaves.pop()
				}

				crtLevel = +level
				rootLeaf.leaves.push({node, value, leaves: []})
			}
		}
		// console.log("FINAL")
		// console.log(rootLeaf)
		Tree.update(branchLeaves[0].leaves)
	} else if (treeData.value.split(",").length % 2 === 1) {
		// A,3,P,5,3
		let data = treeData.value.split(","),
			throws = data.pop()
		Tree.update({data, throws})
	} else {
		return
	}

	// Update the katex data.
	katexAutoRender(tree.value)
}

onMounted(() => {
	// Tree = new ProbabilityTree(document.getElementById("tree"), treeData.value)
	Tree = new ProbabilityTree(tree.value)
	updateTree()
})

watch(()=>props.treeData, ()=>{
	updateTree()
})
</script>
