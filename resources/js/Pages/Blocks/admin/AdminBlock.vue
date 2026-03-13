<script lang="ts" setup>
import {BlockInterface} from "@/types/modelInterfaces.ts"
import FilteredList from "@/Components/Ui/FilteredList.vue"
import LayoutAdmin from "@/Layouts/LayoutAdmin.vue"
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import {computed, nextTick, ref} from "vue"

defineOptions({layout: LayoutAdmin})

const props = defineProps<{
	blocks: BlockInterface[]
}>()

const blocksWithErrors = ref<BlockInterface[]>([])

const loading = ref<boolean>(true)
const blockId = ref<number>(0)
const currentBlock = computed<BlockInterface>(() => {
	if (blockId.value === null) return null

	return props.blocks[blockId.value]
})

function nextBlock(success: boolean) {
	if (!success) {
		blocksWithErrors.value.push(props.blocks[blockId.value])
	}

	setTimeout(() => {
		nextTick(() => {
			if (blockId.value < props.blocks.length - 1) {
				blockId.value++
			} else {
				blockId.value = null
				loading.value = false
			}
		})
	}, 100)

}
</script>

<template>
	<main
		class="scolcours-container"
	>
		<div
			v-if="loading"
			class="mb-10"
		>
			<div>analyse du {{ blockId }} sur {{ blocks.length }}</div>

			<block-show
				:key="`block-${blockId}`"
				:block="currentBlock"
				@success="nextBlock"
			/>
		</div>

		<div v-else>
			<div>{{ blocksWithErrors.length }} blocks avec erreurs sur {{ blocks.length }}</div>
			<filtered-list
				:list="blocksWithErrors"
				list-class="flex flex-col gap-12"
			>
				<template #card="{ item }: { item: BlockInterface }">
					<block-show
						:block="item"
					/>
				</template>
			</filtered-list>
		</div>
	</main>
</template>


