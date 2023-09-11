<!--
Affichage des illustrations
-->
<template>
	<figure
		ref="root"
	>
		<div
			v-if="$page.props.auth.can.admin && !preview && editMode.enabled.value"
			class="flex justify-end mb-3"
		>
			<div
				v-theme.bg.text.admin
				class="px-3 py-2 rounded flex place-content-center font-code"
			>
				<button
					class="draggable-handle text-xs px-1 text-gray-400 hover:text-black"
				>
					<i class="bi bi-arrows-move"/>
				</button>
				<button
					class="text-xs ml-3"
					@click="showEditForm=true"
				>
					éditer l'illustration (id: {{ theIllustration.id }}) <i class="bi bi-pencil ml-2"/>
				</button>
			</div>
		</div>
		<div v-if="theIllustration.type==='image'">
			<img :src="'\\storage\\'+theIllustration.code">
		</div>
		<pi-draw-parser
			v-if="theIllustration.type==='draw'"
			:draw="blockIllustration"
			class="max-w-lg mx-auto"
		/>
		<div
			v-if="theIllustration.type==='component'"
		>
			<component
				:is="IllustrationComponent"
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
						<i class="bi bi-arrow-clockwise"/>
					</div>
					<div>mise à jour</div>
				</button>
			</div>
		</div>

		<figcaption
			v-if="blockIllustration.title"
			v-katex.auto="blockIllustration.title"
			class="text-center text-xs border border-gray-200 bg-gray-100 py-1"
		/>

		<!-- edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:illustration="theIllustration"
				@change="theIllustration = $event"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</figure>
</template>

<script setup lang="ts">
import {computed, defineAsyncComponent, inject, ref} from "vue"
import PiDrawParser from "@/Components/Pi/PiDrawParser.vue"
import {useFormattedBody} from "@/Composables/useHelpers"
import {getModule, MODULE_TYPES} from "@/scolcours";
import {editModeInterface} from "@/types";

const props = defineProps({
		illustration: {type: Object, required: true},
		preview: {type: Boolean, default: false}
	}),
	emits = defineEmits(["destroy"])

let blockData = inject("blockData", {})
let root = ref(null),
	showEditForm = ref(false),
	editForm = defineAsyncComponent(() =>
		import("@/Components/Posts/Illustrations/IllustrationForm.vue")
	),
	theIllustration = ref(props.illustration),
	editMode = inject<editModeInterface>("editMode"),
	blockIllustration = computed(() => {
		return {
			title: theIllustration.value.title ? useFormattedBody(theIllustration.value.title, blockData) : "",
			code: useFormattedBody(theIllustration.value.code, blockData),
			parameters: theIllustration.value.parameters ? useFormattedBody(theIllustration.value.parameters, blockData) : ""
		}
	}),
	updateComponentKey = ref(0)

const IllustrationComponent = computed(
	() => {
		if (props.illustration.type === "component" && props.illustration.value !== null) {
            return getModule(props.illustration.value, MODULE_TYPES.ILLUSTRATION)
		} else {
			return false
		}
	}
)

</script>
