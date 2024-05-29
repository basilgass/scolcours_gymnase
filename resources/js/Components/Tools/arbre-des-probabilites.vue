<script lang="ts" setup>
/** Tools
 * title: arbre des probabilités
 * body: création d'un arbre pondéré
 * tags: 3M,3C
 */
import ToolForm, { IToolForm } from "@/Components/Tools/Parts/ToolForm.vue"
import { computed, inject, ref } from "vue"
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
import { flashInterface } from "@/types"

const flash = inject<flashInterface>('flash')

const forms: IToolForm[] = [
	{
		label: "paramètres",
		value: ref(""),
		message: "R=p|f|d/1-9/d,B=p|f|d,S=???",
		fromUrl: 'p'
	},
	{
		label: "code",
		type: "textarea",
		value: ref(""),
		fromUrl: 'code'
	}
]

flash.add('Pour les paramètres, R=p|f|d/1-9/d,B=p|f|d,S=???')

const treeData = computed(() => forms[1].value.value as string)
const treeParams = computed(() => forms[0].value.value as string)

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<pi-probability-tree
			:tree-data="treeData"
			:tree-params="treeParams"
		/>
	</article>
</template>
