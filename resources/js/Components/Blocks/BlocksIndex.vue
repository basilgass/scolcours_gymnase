<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import type { flashInterface } from "@/types"
import type { BlockInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { defineModel, inject } from "vue"

const props = defineProps<{
	postId: number,
}>()

const blocks = defineModel<BlockInterface[]>()

const editMode = useStoreEditMode()

const flash = inject<flashInterface>("flash")

function addBlock(after?: number) {
	axios.post(
		route("posts.blocks.store", [props.postId]),
		{
			after: after === undefined ? null : after
		}
	).then((res) => {
		flash.success("Block ajouté avec succès.")
		if (after === undefined) {
			blocks.value.push(res.data)
		} else {
			blocks.value.splice(after + 1, 0, res.data)
		}
	}).catch((res) => {
		flash.error("Erreur lors de l'ajout du block.")
		console.warn("add block: ", res.data)
	})
}

function updateBlockOrder(){
	axios.patch(route("posts.updateBlocksOrder", [props.postId]), {
		order: blocks.value.map((block, index)=>{
			return {
				id: block.id,
				order: index
			}
		})
	}).then(()=>{
		// Show flash message.
		flash.success('Les blocks ont bien été ré-ordré.')
	}).catch((err)=>{
		// Show flash error message
		console.log(err.response.data.message)
		flash.error('Problème de réorganisation des blocks.')
	})


}

</script>
<template>
	<article class="flex flex-col gap-4">
		<div
			v-admin="editMode.enable"
			class="text-right"
		>
			<button
				class="addButton"
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
					<div
						v-admin="editMode.enable"
						class="absolute -right-2 -bottom-2 addButton"
						@click="addBlock(element.order)"
					>
						<i class="bi bi-plus-circle" />
					</div>

					<block-show
						class="overflow-hidden max-w-full"
						:class="{
							'mt-10 rounded-t-lg': !element.merge,
							'rounded-b-lg': !blocks[index+1]?.merge
						}"
						:block="element"
					/>
				</div>
			</template>
		</draggable>
	</article>
</template>

<style scoped lang="postcss">
.addButton {
	@apply cursor-pointer
	bg-white text-xl w-[20px] h-[20px] rounded-full z-10
	hover:bg-black hover:text-white
	transition-colors duration-500;
}

.bi::before, [class^="bi-"]::before, [class*=" bi-"]::before {
	vertical-align: 1px;
}
</style>
