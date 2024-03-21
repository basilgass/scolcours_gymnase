<!--
Formulaire d'édition d'une illustratrion
TODO: Améliorer les illustrations de type components.
TODO: Ajouter des "helpers", pour avoir des indications des paramètres par exemple.
-->
<script lang="ts" setup>
import { computed, defineAsyncComponent, PropType, ref } from "vue"
import { IllustrationInterface } from "@/types/modelInterfaces"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import axios from "axios"

const emits = defineEmits(["change", "destroy"])
const props = defineProps({
	illustration: { type: Object as PropType<IllustrationInterface>, required: true },
	preview: {type: Boolean, default: true}
})

const theIllustration = ref<IllustrationInterface>(props.illustration)
const editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Illustrations/IllustrationForm_OLD.vue")
		)
	}),
	showEditForm = ref(props.illustration?.isNew === true)

function deleteIllustration() {
	axios
		.post(route("illustrations.destroy", [props.illustration.id]), {
			_method: "delete"
		})
		.then(() => {
			emits("destroy", props.illustration.id)
		})
		.catch((error) => console.error(error))
}
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
			<confirm-button
				class="btn-delete btn-xs ml-10"
				@confirm="deleteIllustration"
			>
				<i class="bi bi-trash" />
			</confirm-button>
		</div>

		<div v-if="showEditForm">
			<component
				:is="editForm"
				v-model="showEditForm"
				:illustration="props.illustration"
				@destroy="emits('destroy', theIllustration.id)"
			/>
		</div>
	</div>
</template>
