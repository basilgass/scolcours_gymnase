<script lang="ts" setup>
import EditLink from "@/Components/Ui/EditLink.vue"
import {getModule, MODULE_TYPES} from "@/scolcours.ts"
import {computed, inject, watch} from "vue"
import {onClick_answerIndex} from "@/Components/Questions/useQuestionHelpers.ts"
import Card from "@/Components/Ui/Card.vue"
import {useFormattedBody} from "@/Composables/useHelpers.ts"
import {useScriptLoader, UseScriptLoaderReturn} from "@/Composables/useScriptLoader.ts"
import {IllustrationInterface} from "@/types/modelInterfaces.ts"

const props = defineProps<{
	illustration: IllustrationInterface
	clickThrough?: boolean
}>()

const blockSsript = inject<UseScriptLoaderReturn>('blockScript', useScriptLoader(""))

const illustrationWithScript = computed(() => {

	return {
		parameters: useFormattedBody(props.illustration.parameters ?? "", blockSsript.merged),
		code: useFormattedBody(props.illustration.code ?? "", blockSsript.merged)
	}
})

function getWidget() {
	return getModule(
		props.illustration.widget ? props.illustration.widget.component : null,
		MODULE_TYPES.WIDGET
	)
}

// Get the component to display
let widgetComponent = getWidget()

watch(() => props.illustration.widget_id, () => {
	widgetComponent = getWidget()
})


function click($event: MouseEvent) {
	const answerIndex = onClick_answerIndex($event)
	if (answerIndex !== null) {
		return
	}

	if (props.clickThrough) {
		return
	}

	$event.stopPropagation()
}

</script>

<template>
	<Card>
		<figure
			:id="`illustration-${illustration.id}`"
			ref="root"
			class="relative"
			:class="illustration.css"
			@click="click"
		>
			<edit-link
				:href="route('admin.illustrations.edit', {illustration:illustration.id})"
				:label="`illustration ${illustration.id}`"
			/>

			<component
				:is="widgetComponent"
				:illustration="illustrationWithScript"
			/>
		</figure>
		<template
			v-if="props.illustration.title"
			#footer
		>
			<div
				v-katex.auto="props.illustration.title"
				class="text-center text-xs"
			/>
		</template>
	</Card>
</template>
