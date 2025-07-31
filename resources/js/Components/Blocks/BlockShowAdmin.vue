<script lang="ts" setup>

import FormMaker from "@/Components/Form/FormMaker.vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {BlockInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {inject, ref} from "vue"
import {flashInterface} from "@/types"

const editMode = useStoreEditMode()
const flash = inject<flashInterface>('flash')

const props = defineProps<{
	block: BlockInterface
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
			</div>
		</slot>

		<slot name="adminCenter" />

		<slot name="adminRight">
			<div class="gap-2 hidden @md:flex">
				<form-maker
					v-model="theBlock.template"
					inline-label
					label="[b|i],[md|lg|xl]:[#]b+[#]i"
					label-class="whitespace-nowrap"
					sm
					@enter="updateTemplate"
					btn="bi bi-save"
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
