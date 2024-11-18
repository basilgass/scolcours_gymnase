<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import { BlockInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { ref } from "vue"

const editMode = useStoreEditMode()

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
		<slot name="adminLeft">
			<div class="flex gap-5 items-baseline">
				<div class="draggable-handle cursor-move">
					<i class="bi bi-arrows-move px-3" />
				</div>

				<edit-link
					:id="block.id"
					inline
					label="block id: "
					route-name="blocks.edit"
				/>
			</div>
		</slot>

		<slot name="adminCenter" />

		<slot name="adminRight">
			<div class="flex gap-2">
				<form-maker
					v-model="theBlock.template"
					:axios="{
						model: 'Block',
						id: block.id,
						column: 'template',
					}"
					inline-label
					input-class="bg-white text-black"
					label="[b|i],[md|lg|xl]:[#]b+[#]i"
					label-class="whitespace-nowrap"
					sm
				/>
				<button
					:class="theBlock.merge?'rotate-180':'rotate-0'"
					class="transition transition-all"
					@click="saveMerge()"
				>
					<i class="bi bi-arrow-bar-up" />
				</button>
			</div>
		</slot>
	</div>
</template>
