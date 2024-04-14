<script lang="ts" setup>

import { BlockInterface } from "@/types/modelInterfaces"
import { inject, PropType, Ref, ref } from "vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import { flashInterface } from "@/types"

const editMode = inject<boolean>("editMode")
const flash = inject<flashInterface>("flash")
const postBlocks = inject<Ref<BlockInterface[]>>("postBlocks", ref([]))

const props = defineProps({
	block: { type: Object as PropType<BlockInterface>, required: true }
})

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

function moveBlock(direction: "top" | "up" | "down" | "bottom") {
	axios.patch(route("blocks.move", [props.block.id]), {
		_method: "patch",
		direction
	})
		.then((res) => {
			flash.success("La block a été déplacé")
			postBlocks.value = res.data
		})
		.catch((res) => {
			flash.error(res.response.data.message, { timeout: 10 * 1000 })
		})
}
</script>
<template>
	<div
		v-admin="editMode"
		v-theme.bg.text.admin
		class="py-1 px-2 flex justify-between items-center"
	>
		<edit-link
			:id="block.id"
			inline
			label="block id: "
			route-name="blocks.edit"
		/>

		<div class="flex gap-2 items-baseline">
			<div class="text-xs">
				pos: {{ block.order }}
			</div>
			<button
				:class="block.order===0?'text-gray-400':''"
				:disabled="block.order===0"
				@click="moveBlock('top')"
			>
				<i class="bi bi-chevron-bar-up" />
			</button>
			<button
				:class="block.order===0?'text-gray-400':''"
				:disabled="block.order===0"
				@click="moveBlock('up')"
			>
				<i class="bi bi-chevron-up" />
			</button>
			<button
				:class="block.order===postBlocks.length-1?'text-gray-400':''"
				:disabled="block.order===postBlocks.length-1"
				@click="moveBlock('down')"
			>
				<i class="bi bi-chevron-down" />
			</button>
			<button
				:class="block.order===postBlocks.length-1?'text-gray-400':''"
				:disabled="block.order===postBlocks.length-1"
				@click="moveBlock('bottom')"
			>
				<i class="bi bi-chevron-bar-down" />
			</button>
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
				:class="theBlock.merge?'rotate-180':''"
				@click="saveMerge()"
			>
				<i class="bi bi-arrow-bar-up" />
			</button>
		</div>
	</div>
</template>
