<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import type {flashInterface} from "@/types"
import type {BlockInterface} from "@/types/modelInterfaces.ts"
import axios from "axios"
import {defineModel, inject} from "vue"
import {router} from "@inertiajs/vue3"

const props = defineProps<{
	postId: number,
}>()

const blocks = defineModel<BlockInterface[]>()

const editMode = useStoreEditMode()

const flash = inject<flashInterface>("flash")

function addBlock(after = -1) {
	axios.post(
		route("api.admin.blocks.store"),
		{
			target_id: props.postId,
			target_type: 'post',
			order: after === undefined ? null : after+1
		}
	).then((res) => {
		flash.success("Block ajouté avec succès.")
		// On va éditer le post directement
		router.visit(route('admin.blocks.edit', {block: res.data.id}))
	}).catch((res) => {
		flash.error("Erreur lors de l'ajout du block.")
		console.error(
			res.response.data.message
		)
	})
}

function updateBlockOrder() {
	axios.patch(route("api.admin.posts.blocks.order", [props.postId]), {
		order: blocks.value.map((block, index) => {
			return {
				id: block.id,
				order: index
			}
		})
	}).then(() => {
		// Show flash message.
		flash.success('Les blocks ont bien été ré-ordré.')
	}).catch((err) => {
		// Show flash error message
		console.log(err.response.data.message)
		flash.error('Problème de réorganisation des blocks.')
	})
}

function removeBlock(block: {id: number, target_type: string, target_id: number}) {
	blocks.value = blocks.value.filter(b=>b.id!==block.id)
}

</script>
<template>
	<article class="flex flex-col gap-4">
		<div
			v-admin="editMode.enable"
			class="text-right"
		>
			<button
				class="bg-action text-xl
					 w-[24px] h-[24px] z-10
					cursor-pointer"
				@click="addBlock()"
			>
				<i class="bi bi-plus-circle" />
			</button>
		</div>

		<draggable
			:list="blocks"
			class="grid grid-cols-1"
			item-key="id"
			handle=".draggable-handle"
			v-bind="{
				animation: 300,
				disabled: !editMode.enable
			}"
			@end="updateBlockOrder"
		>
			<template #item="{ element, index } : {element: BlockInterface, index: number}">
				<div
					class="relative"
				>
					<button
						v-admin="editMode.enable"
						class="absolute -right-2 -bottom-2
							text-xl
							w-[24px] h-[24px] z-10 transparent
							cursor-pointer"
						@click="addBlock(index)"
					>
						<i class="bi bi-plus-circle-fill" />
					</button>

					<block-show
						class="overflow-hidden max-w-full border-x"
						:class="{
							'mt-10 rounded-tl-sm rounded-tr-lg border-t': !element.merge && index>0,
							'rounded-bl-sm rounded-br-lg border-b': !blocks[index+1]?.merge
						}"
						:block="element"
						@moved="removeBlock($event)"
					/>
				</div>
			</template>
		</draggable>
	</article>
</template>
