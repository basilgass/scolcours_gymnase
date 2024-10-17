<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import { useStoreEditMode } from "@/stores/useStoreEditMode.ts"
import type { flashInterface } from "@/types"
import type { BlockInterface } from "@/types/modelInterfaces.ts"
import axios from "axios"
import { computed, defineModel, inject } from "vue"

const props = defineProps<{
	postId: number,
}>()

const blocks = defineModel<BlockInterface[]>()

const editMode = useStoreEditMode()

const flash = inject<flashInterface>("flash")

const groupedBlocks = computed(() => {
	// The groupedBlocks might be grouped
	let arr: BlockInterface[][] = []

	blocks.value.forEach(block => {
		if (block.merge === true) {
			arr[arr.length - 1].push(block)
		} else {
			arr.push([block])
		}
	})

	return arr
})

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

</script>
<template>
	<article class="flex flex-col gap-4">
		<div
			class="text-right"
			v-admin="editMode.enable"
		>
			<button
				class="addButton"
				@click="addBlock()"
			>
				<i class="bi bi-plus-circle" />
			</button>
		</div>
		<div
			v-for="group in groupedBlocks"
			:key="group[0].id"
		>
			<div
				v-for="(block, index) in group"
				:key="`block-${block.id}`"
				class="shadow relative"
			>
				<div
					v-admin="editMode.enable"
					class="absolute -right-2 -bottom-2 addButton"
					@click="addBlock(block.order)"
				>
					<i class="bi bi-plus-circle" />
				</div>
				<block-show
					:block="block"
					:group-index="index"
				/>
			</div>
		</div>
	</article>
</template>

<style scoped>
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