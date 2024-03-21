<!--
Affichage des illustrations
-->
<script lang="ts" setup>
import { computed, inject, PropType, Ref, ref, watch } from "vue"
import { useFormattedBody } from "@/Composables/useHelpers"
import { getModule, MODULE_TYPES } from "@/scolcours"
import { IllustrationInterface } from "@/types/modelInterfaces"
import IllustrationEdit from "@/Components/Posts/Illustrations/IllustrationEdit_OLD.vue"

interface IllustrationInterfaceExtended extends IllustrationInterface {
	isNew?: boolean;
}

const props = defineProps({
		illustration: { type: Object as PropType<IllustrationInterfaceExtended>, required: true },
		preview: { type: Boolean, default: false }
	}),
	emits = defineEmits(["destroy"])

const blockData = inject("blockData", {})
const root = ref(null),
	theIllustration = ref(props.illustration),
	editMode = inject<Ref<boolean>>("editMode"),
	blockIllustration = computed(() => {
		return {
			title: theIllustration.value.title
				? useFormattedBody(theIllustration.value.title, blockData)
				: "",
			code: useFormattedBody(theIllustration.value.code, blockData),
			parameters: theIllustration.value.parameters
				? useFormattedBody(
					theIllustration.value.parameters,
					blockData
				)
				: ""
		}
	}),
	updateComponentKey = ref(0)

watch(blockIllustration, () => {
	updateComponentKey.value++
})
const widgetComponent = computed(() => {
	return getModule(
		props.illustration.widget ? props.illustration.widget.component : null,
		MODULE_TYPES.WIDGET
	)
})

const figureClass = computed(() => {
	if (theIllustration.value.css) {
		return theIllustration.value.css
	}

	return "w-full max-w-xl mx-auto"
})
function destroyIllustration(id: number) {
	emits("destroy", id)
}
</script>

<template>
	<figure
		ref="root"
		:class="figureClass"
	>
		<illustration-edit
			v-if="!preview && editMode"
			v-admin
			:illustration="theIllustration"
			@destroy="destroyIllustration"
		/>

		<component
			:is="widgetComponent"
			:key="updateComponentKey"
			:illustration="blockIllustration"
		/>

		<div class="float-right">
			<button
				v-if="preview"
				class="btn btn-xs flex gap-3 group"
				@click="updateComponentKey++"
			>
				<div class="group-hover:rotate-180 transition-all">
					<i class="bi bi-arrow-clockwise" />
				</div>
				<div>mise à jour</div>
			</button>
		</div>

		<figcaption
			v-if="blockIllustration.title"
			v-katex.auto="blockIllustration.title"
			class="text-center text-xs border border-gray-200 bg-gray-100 py-1 mt-3"
		/>
	</figure>
</template>
