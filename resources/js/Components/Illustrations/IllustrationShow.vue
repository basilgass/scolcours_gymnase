<script setup lang="ts">
import EditLink from "@/Components/Ui/EditLink.vue"
import { getModule, MODULE_TYPES } from "@/scolcours.ts"
import type { IllustrationInterface } from "@/types/modelInterfaces.ts"
import { computed } from "vue"

const props = defineProps<{
	illustration: IllustrationInterface
	clickThrough: boolean
}>()

// Get the component to display
const widgetComponent = computed(() => {
	return getModule(
		props.illustration.widget ? props.illustration.widget.component : null,
		MODULE_TYPES.WIDGET
	)
})

function click($event: MouseEvent){
	if(props.clickThrough){return}

	$event.stopPropagation()
}
</script>

<template>
	<figure
		@click="click"
		:id="`illustration-${illustration.id}`"
		ref="root"
		class="relative"
	>
		<edit-link
			:id="props.illustration.id"
			route-name="illustrations.edit"
		/>

		<component
			:is="widgetComponent"
			:illustration="props.illustration"
		/>

		<figcaption
			v-if="props.illustration.title"
			v-katex.auto="props.illustration.title"
			class="text-center text-xs border border-gray-200 bg-gray-100 py-1 mt-3"
		/>
	</figure>
</template>

<style scoped></style>
