<script setup lang="ts">
	import FormWrapper from "@/Components/Form/FormWrapper.vue"
	import { computed, defineAsyncComponent, inject, ref } from "vue"
	import axios from "axios"
	import { flashInterface } from "@/types"

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

	const flash = inject<flashInterface>("flash")
	const updateBlockTemplate = function () {
		// Save to database.
		axios
			.patch(route("blocks.updateTemplate", [props.block.id]), {
				_method: "PATCH",
				template: theBlock.value.template,
			})
			.then(() => {
				flash.success("Le template a bien été enregistrée.")
			})
			.catch((res) => {
				console.log(res)
				flash.error("Il y a eu un problème avec le template.")
			})
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

			<div class="grid grid-cols-1 gap-1">
				<form-wrapper
					label="grille"
					inline-label
					sm
					v-model="theBlock.template"
					@enter="updateBlockTemplate"
				/>
				<div class="flex gap-1">
					<button class="btn btn-xs" @click="theBlock.template = ''">
						<i class="bi bi-ban" />
					</button>
					<button
						class="btn btn-xs font-code"
						@click="theBlock.template = 'bi,md:3b+i'"
					>
						bi,md:3b+i
					</button>
					<button
						class="btn btn-xs font-code"
						@click="theBlock.template = 'bi,md:b+i,lg:3b+2i'"
					>
						bi,md:b+i,lg:3b+2i
					</button>
					<button
						class="btn btn-xs bg-gray-100 text-slate-600"
						@click="updateBlockTemplate"
					>
						<i class="bi bi-check2" />
					</button>
				</div>
			</div>

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
