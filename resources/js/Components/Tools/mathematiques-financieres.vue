<script lang="ts" setup>
/** Tools
 * title:
 * body:
 * parameters:
 * tags:
 */
import ToolForm, {IToolForm} from "@/Components/Tools/Parts/ToolForm.vue"
import {useToolsStorage} from "@/Composables/useToolsStorage.ts"
import {computed} from "vue"
import Card from "@/Components/Ui/Card.vue"
import ToolError from "@/Components/Tools/Parts/ToolError.vue"

const {restoreTool} = useToolsStorage()
const forms: IToolForm[] = restoreTool([
	/** inputs to load */
])

const result = computed(() => {
	/** content */

	return false
})
</script>

<template>
	<article>
		<tool-form :forms="forms" />

		<Card v-if="result">
			<!-- content -->
		</Card>
		<tool-error v-else />
	</article>
</template>
