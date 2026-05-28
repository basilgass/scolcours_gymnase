<script lang="ts" setup>
import {getModule, MODULE_TYPES} from "@/scolcours.ts"
import {computed, inject} from "vue"
import {onClick_answerIndex} from "@/Components/Questions/useQuestionHelpers.ts"
import Card from "@/Components/Ui/Card.vue"
import {useFormattedBody} from "@/Composables/useHelpers.ts"
import {useScriptLoader, UseScriptLoaderReturn} from "@/Composables/useScriptLoader.ts"
import {IllustrationInterface} from "@/types/modelInterfaces.ts"
import EditLink from "@/Components/Ui/EditLink.vue"

const props = defineProps<{
	illustration: IllustrationInterface
	clickThrough?: boolean
}>()

const blockSsript = inject<UseScriptLoaderReturn>('blockScript', useScriptLoader(""))

const illustrationWithScript = computed(() => {

	return {
		parameters: useFormattedBody(props.illustration.parameters ?? "", blockSsript.merged, false),
		code: useFormattedBody(props.illustration.code ?? "", blockSsript.merged, false)
	}
})

function getWidget() {
	return getModule(
		props.illustration.widget ? props.illustration.widget.component : null,
		MODULE_TYPES.WIDGET
	)
}

// Get the component to display
const widgetComponent = computed(() => getWidget())

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
	<Card :class="illustration.css">
		<template #admin>
			<div class="flex justify-between">
				<i class="draggable-handle cursor-move bi bi-arrows-move" />
				<edit-link
					:href="route('admin.illustrations.edit', {illustration:illustration.id})"
					:label="`illustration (id : ${illustration.id})`"
					inline
				/>
			</div>
		</template>
		<template
			v-if="props.illustration.title"
			#header
		>
			<div
				v-katex.auto="props.illustration.title"
				class="text-center text-lg
				bg-slate-50 dark:bg-slate-700
				-mx-3 -my-2 py-2 px-3 rounded-t"
			/>
		</template>

		<figure
			:id="`illustration-${illustration.id}`"
			ref="root"
			class="relative"
			@click="click"
		>
			<component
				:is="widgetComponent"
				:illustration="illustrationWithScript"
			/>
		</figure>
		<template
			v-if="props.illustration.footer"
			#footer
		>
			<div
				v-katex.auto="props.illustration.footer"
				class="text-center text-xs"
			/>
		</template>
	</Card>
</template>
