<script setup lang="ts">

import IllustrationShow from "@/Components/Illustrations/IllustrationShow.vue"
import {BlockInterface, IllustrationInterface} from "@/types/modelInterfaces.ts"
import {useStoreEditMode} from "@/stores/useStoreEditMode.ts"
import {ref} from "vue"
import axios from "axios"
import {useStoreFlashMessage} from "@/stores/useStoreFlashMessage.ts"

const props = defineProps<{
	block: BlockInterface
}>()
const illustrations = ref<IllustrationInterface[]>(props.block.illustrations)

const editMode = useStoreEditMode()

const flash = useStoreFlashMessage()

function updateIllustrationsOrder() {
	axios.patch(route("api.admin.blocks.illustrations.order", {block: props.block.id}), {
		order: illustrations.value.map((block, index) => {
			return {
				id: block.id,
				order: index
			}
		})
	}).then(() => {
		// Show flash message.
		flash.success('Les illustrations ont bien été ré-ordré.')
	}).catch((err) => {
		// Show flash error message
		console.log(err.response.data.message)
		flash.error('Problème de réorganisation des illustrations.')
	})
}
</script>

<template>
	<draggable
		:list="illustrations"
		:class="block.illustrationsGrid"
		item-key="id"
		handle=".draggable-handle"
		v-bind="{
			animation: 300,
			disabled: !editMode.enable
		}"
		@end="updateIllustrationsOrder"
	>
		<template #item="{ element } : {element: IllustrationInterface, index: number}">
			<div
				class="relative"
				:key="`illustration-${element.id}`"
			>
				<div
					v-admin="editMode.enable"
					class="draggable-handle cursor-move absolute -top-2 -left-2 z-10 bg-content"
				>
					<i class=" bi bi-arrows-move" />
				</div>
				<illustration-show
					:illustration="element"
				/>
			</div>
		</template>
	</draggable>
</template>

<style scoped>

</style>
