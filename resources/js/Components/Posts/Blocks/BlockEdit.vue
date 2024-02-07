<script lang="ts" setup>
import { computed, defineAsyncComponent, inject, PropType, ref } from "vue"
import axios from "axios"
import { flashInterface } from "@/types"
import FormMaker from "@/Components/Form/FormMaker.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { BlockInterface } from "@/types/modelInterfaces"

interface BlockInterfaceExtended extends BlockInterface {
	isNew?: boolean
}
const props = defineProps({
	block: { required: true, type: Object as PropType<BlockInterfaceExtended> },
	noDelete: { type: Boolean, default: false },
	noTitle: { type: Boolean, default: false },
	noType: { type: Boolean, default: false },
	noSwitch: { type: Boolean, default: false },
	noScript: { type: Boolean, default: false },
	noData: { type: Boolean, default: false },
	noBlur: { type: Boolean, default: false },
	noGrid: { type: Boolean, default: false }
})
const emits = defineEmits(["destroy"])

let theBlock = ref(props.block)

let showEditForm = ref(props.block?.isNew === true),
	editForm = computed(() => {
		return defineAsyncComponent(
			() => import("@/Components/Posts/Blocks/BlockForm.vue")
		)
	}),
	updateBlock = function(b) {
		theBlock.value = b
	}

const flash = inject<flashInterface>("flash")

const updateBlockTemplate = function() {
	// Save to database.
	axios
		.patch(route("blocks.updateTemplate", [props.block.id]), {
			_method: "PATCH",
			template: theBlock.value.template
		})
		.then(() => {
			flash.success("Le template a bien été enregistrée.")
		})
		.catch((res) => {
			console.log(res)
			flash.error("Il y a eu un problème avec le template.")
		})
}

const deleteBlock = function() {
	axios
		.post(route("blocks.destroy", [props.block.id]), {
			_method: "delete"
		})
		.then(() => {
			emits("destroy", props.block.id)

			flash.add("Le block a été supprimé")

		})
		.catch((error) => console.error(error))
}

</script>

<template>
	<div>
		<div
			v-theme.bg.text.admin
			class="py-2 px-3 rounded font-code flex justify-between place-content-center"
		>
			<button
				class="text-xs mr-2"
				@click="showEditForm = true"
			>
				<i class="bi bi-pencil mr-2" /> éditer (id:
				{{ theBlock.id }})
			</button>

			<div
				v-if="!props.noGrid"
				class="grid-cols-1 gap-1
                   hidden md:grid"
			>
				<form-maker
					v-model="theBlock.template"
					inline-label
					label="grille"
					sm
					@enter="updateBlockTemplate"
				/>
				<div class="flex gap-1">
					<button
						class="btn btn-xs"
						@click="theBlock.template = ''"
					>
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


			<div class="my-auto flex gap-5">
				<confirm-button
					v-if="!props.noDelete"
					class="btn-delete btn-xs"
					@confirm="deleteBlock"
				>
					supprimer
				</confirm-button>

				<button class="draggable-handle text-xs px-1">
					<i class="bi bi-arrows-move" />
				</button>
			</div>
		</div>

		<!-- Edit form -->
		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:block="theBlock"
				:no-data="props.noData"
				:no-delete="props.noDelete"
				:no-grid="props.noGrid"
				:no-script="props.noScript"
				:no-switch="props.noSwitch"
				:no-title="props.noTitle"
				:no-type="props.noType"
				:overflow-scroll="true"
				@change="updateBlock"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</div>
</template>

<style scoped></style>
