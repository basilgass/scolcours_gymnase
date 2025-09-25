<script lang="ts" setup>
import PiProbabilityTree from "@/Components/Pi/PiProbabilityTree.vue"
/** Tools
 * title: arbre des probabilités
 * body: création d'un arbre pondéré
 * tags: 3M,3C
 */
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {computed, ref} from "vue"
import Card from "@/Components/Ui/Card.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

// TODO: documentation dans la page
const flash = useStoreFlashMessage()
const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
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
		fromUrl: 'code',
	}
])

flash.info('Pour les paramètres, R=p|f|d/1-9/d,B=p|f|d,S=???')

const treeData = computed(() => forms[1].value.value as string)
const treeParams = computed(() => forms[0].value.value as string)

</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card>
			<pi-probability-tree
				:tree-data="treeData"
				:tree-params="treeParams"
			/>
		</Card>
	</article>
</template>
