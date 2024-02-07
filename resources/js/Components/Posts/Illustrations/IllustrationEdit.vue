<!--
Formulaire d'édition d'une illustratrion
TODO: Améliorer les illustrations de type components.
TODO: Ajouter des "helpers", pour avoir des indications des paramètres par exemple.
-->
<script lang="ts" setup>
import { computed, defineAsyncComponent, PropType, ref } from "vue"
import { IllustrationInterface } from "@/types/modelInterfaces"

const emits = defineEmits(["change", "destroy"])
const props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
	preview: {type: Boolean, default: true}
})

let theIllustration = ref<IllustrationInterface>(props.illustration)
const editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Illustrations/IllustrationForm.vue")
		)
	}),
	showEditForm = ref(props.illustration?.isNew === true)

</script>

<template>
	<div class="flex justify-end mb-3">
		<div
			v-theme.bg.text.admin
			class="px-3 py-2 rounded flex place-content-center font-code"
		>
			<button
				class="draggable-handle text-xs px-1 text-gray-400 hover:text-black"
			>
				<i class="bi bi-arrows-move" />
			</button>
			<button
				class="text-xs ml-3"
				@click="showEditForm = true"
			>
				éditer l'illustration (id: {{ theIllustration.id }})
				<i class="bi bi-pencil ml-2" />
			</button>
		</div>

		<div v-if="showEditForm">
			<component
				:is="editForm"
				v-model="showEditForm"
				:illustration="props.illustration"
			/>
		</div>
	</div>
</template>
