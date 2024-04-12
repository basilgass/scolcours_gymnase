<script lang="ts" setup>

import { BlockInterface } from "@/types/modelInterfaces"
import { inject, PropType, ref } from "vue"
import EditLink from "@/Components/Ui/EditLink.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"

const editMode = inject<boolean>('editMode')

const props = defineProps({
	block: { type: Object as PropType<BlockInterface>, required: true }
})

const theBlock = ref(props.block)


function saveMerge(){
	const value = !theBlock.value.merge

	axios.patch(route('api.update.a.value', {
		_method: 'patch',
		model: 'Block',
		id: props.block.id,
		column: 'merge',
		value
	}))
		.then(()=>{
			theBlock.value.merge = value
		})
		.catch((res)=>{
			console.warn(res.response.data.message)
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
				@click="saveMerge()"
				:class="theBlock.merge?'rotate-180':''"
			>
				<i class="bi bi-arrow-bar-up" />
			</button>
		</div>
	</div>
</template>
