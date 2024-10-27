<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { BlockInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { ref } from "vue"

const  editMode  = useStoreEditMode()

const props = defineProps<{
	block: BlockInterface
}>()

const theBlock = ref(props.block)

function saveMerge() {
	const value = !theBlock.value.merge

	axios.patch(route("api.update.a.value", {
		_method: "patch",
		model: "Block",
		id: props.block.id,
		column: "merge",
		value
	}))
		.then(() => {
			theBlock.value.merge = value
		})
		.catch((res) => {
			console.warn(res.response.data.message)
		})
}

</script>
<template>
	<div
		v-admin="editMode.enable"
		v-theme.bg.text.admin
		class="py-1 px-2 flex justify-between items-center"
	>
		<edit-link
			:id="block.id"
			inline
			label="block id: "
			route-name="blocks.edit"
		/>

		<div class="draggable-handle cursor-move">
			<i class="bi bi-arrows-move px-10" />
		</div>

		<div class="flex gap-2">
			<form-maker
				v-model="theBlock.template"
				:axios="{
					model: 'Block',
					id: block.id,
					column: 'template',
				}"
				inline-label
				label="template"
				sm
			/>
			<button
				class="transition transition-all"
				:class="theBlock.merge?'rotate-180':'rotate-0'"
				@click="saveMerge()"
			>
				<i class="bi bi-arrow-bar-up" />
			</button>
		</div>
	</div>
</template>
