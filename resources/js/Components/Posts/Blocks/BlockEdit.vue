<script setup lang="ts">
	import FormWrapper from "@/Components/Form/FormWrapper.vue"
	import { computed, defineAsyncComponent, ref } from "vue"

	const props = defineProps({
		block: { required: true, type: Object },
		noDelete: { type: Boolean, default: false },
	})
	const emits = defineEmits(["destroy"])

	let theBlock = ref(props.block)

	let showEditForm = ref(props.block?.isNew === true),
		editForm = computed(() => {
			return defineAsyncComponent(
				() => import("@/Components/Posts/Blocks/BlockForm.vue"),
			)
		}),
		updateBlock = function (b) {
			theBlock.value = b
		}
</script>

<template>
	<div>
		<div
			v-theme.bg.text.admin
			class="py-2 px-3 rounded font-code flex justify-between place-content-center"
		>
			<button class="text-xs mr-2" @click="showEditForm = true">
				<i class="bi bi-pencil mr-2" /> éditer le paragraphe (id:
				{{ theBlock.id }})
			</button>

			<form-wrapper
				label="grille"
				inline-label
				sm
				v-model="theBlock.template"
			/>

			<button class="draggable-handle text-xs px-1">
				<i class="bi bi-arrows-move" />
			</button>
		</div>

		<!-- Edit form -->
		<div v-if="showEditForm" v-admin>
			<component
				:is="editForm"
				v-model="showEditForm"
				:block="theBlock"
				:no-delete="props.noDelete"
				:overflow-scroll="true"
				@change="updateBlock"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</div>
</template>

<style scoped></style>
