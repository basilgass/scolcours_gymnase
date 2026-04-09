<script lang="ts" setup>

import FormInput from "@/Components/Form/FormInput.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {BlockInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {ref} from "vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"
import {router} from "@inertiajs/vue3"

const editMode = useStoreEditMode()
const flash = useStoreFlashMessage()

const props = withDefaults(defineProps<{
		block: BlockInterface,
		indestructible?: boolean
	}>()
	,
	{
		indestructible: false
	})

const emits = defineEmits<{
	moved: [target: { id: number, target_type: string, target_id: number }]
}>()

const theBlock = ref(props.block)

function saveMerge() {
	const value = !theBlock.value.merge

	axios.patch(route('api.admin.blocks.update', {block: props.block.id}), {
		merge: value
	})
		.then(() => {
			theBlock.value.merge = value
		})
		.catch((res) => {
			console.warn(res.response.data.message)
		})
}

function updateTemplate() {
	axios.patch(route('api.admin.blocks.update', {block: props.block.id}), {
		template: theBlock.value.template
	})
		.then(() => {
			flash.success('Le nouveau template a bien été enregistré.')
		})
		.catch((res) => {
			console.warn(res.response.data.message)
		})
}

function deleteBlock() {
	if (props.indestructible) return

	axios
		.post(route("api.admin.blocks.destroy", [theBlock.value.id]), {
			_method: "delete"
		})
		.then((res) => {
			flash.success("Le block a été supprimé")

			// Go to the blockable item.
			router.visit(res.data)
		})
		.catch((error) => console.error(error))
}

</script>
<template>
	<div
		v-admin="editMode.enable"
		v-theme.admin
		class="py-1 px-2 flex justify-between items-center font-code @container"
	>
		<slot name="adminLeft">
			<div class="flex gap-5 items-baseline">
				<div class="draggable-handle cursor-move">
					<i class="bi bi-arrows-move px-3" />
				</div>

				<edit-link
					:label="`block ${block.id}`"
					:href="route('admin.blocks.edit', block.id)"
					inline
				/>

				<move-item-to
					:source-id="block.id"
					source="block"
					target="post"
					@moved="emits('moved', $event)"
				/>

				<confirm-button
					v-if="!indestructible"
					xs
					icon
					@confirm="deleteBlock"
				>
					supprimer
				</confirm-button>
			</div>
		</slot>

		<slot name="adminCenter" />

		<slot name="adminRight">
			<div class="gap-2 hidden @md:flex">
				<FormInput
					v-model="theBlock.template"
					inline-label
					placeholder="[b|i],[md|lg|xl]:[#]b+[#]i"
					sm
					btn="bi bi-save"
					@enter="updateTemplate"
					@button="updateTemplate"
				/>

				<button
					:class="theBlock.merge?'rotate-180':'rotate-0'"
					class="transition-all"
					@click="saveMerge()"
				>
					<i class="bi bi-arrow-bar-up" />
				</button>
			</div>
		</slot>
	</div>
</template>
