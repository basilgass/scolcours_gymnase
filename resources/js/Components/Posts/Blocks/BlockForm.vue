<!--
Formulaire d'édition d'un bloc
-->
<script setup>
import { ref } from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { blockTypes } from "@/scolcours"
import MoveItemTo from "@/Components/Posts/MoveItemTo.vue"
import { useBlock } from "@/Components/Posts/Blocks/useBlock"
import BlockBodyButtons from "@/Components/Posts/Blocks/BlockBodyButtons.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
	const props = defineProps({
		block: { type: Object, required: true },
		modelValue: { type: Boolean, default: false }, // show or hide the block dialog
		switch: { type: Boolean },
		noTitle: { type: Boolean, default: false },
		noType: { type: Boolean, default: false },
		noSwitch: { type: Boolean, default: false },
		noScript: { type: Boolean, default: false },
		noData: { type: Boolean, default: false },
		noBlur: { type: Boolean, default: false },
		noDelete: { type: Boolean, default: false },
		noGrid: { type: Boolean, default: false },
		previewCol: { type: Boolean, default: false },
		overflowScroll: { type: Boolean, default: false },
	})

	let show = ref(props.modelValue),
		theBlock = ref(props.block),
		switchEnable = ref(props.block.switch !== null)

	const { blockBody, blockButtons, random } = useBlock(theBlock)

	let updateSwitchEnable = function () {
		if (switchEnable.value) {
			theBlock.value.switch = false
		} else {
			theBlock.value.switch = null
		}
	}

	let saveBlock = function () {
			axios
				.post(route("blocks.update", [theBlock.value.id]), {
					...theBlock.value,
					switch: switchEnable.value ? theBlock.value.switch : null,
					_method: "PATCH",
				})
				.then((res) => {
					emits("change", res.data.data)
				})
				.catch((error) => {
					console.error(error)
				})
		},
		saveAndCloseBlock = async function () {
			await saveBlock()
			emits("update:modelValue", false)
		},
		deleteBlock = function () {
			axios
				.post(route("blocks.destroy", [props.block.id]), {
					_method: "delete",
				})
				.then((res) => {
					emits("update:modelValue", false)
					emits("destroy", props.block.id)
				})
				.catch((error) => console.error(error))
		}

	const postType = blockTypes
</script>

<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50 max-h-screen"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white border-b border-gray-200 px-5 py-3 mb-5">
				<div class="flex justify-between items-baseline w-full">
					<h1 class="flex items-baseline gap-5">
						<span class="text-xl md:text-2xl">
							édition un block</span>
						<span class="text-xs font-code">
							(id: {{ theBlock.id }})</span>
					</h1>
					<div class="flex gap-3 justify-end">
						<button
							class="btn-primary btn-xs w-[60px]"
							@click="saveBlock"
						>
							<i class="bi bi-save" />
						</button>
						<button
							class="btn-primary btn-xs w-[60px]"
							@click="saveAndCloseBlock"
						>
							<i class="bi bi-save" />
							+ <i class="bi bi-x-lg" />
						</button>
						<button
							class="btn-cancel btn-xs"
							@click="emits('update:modelValue', false)"
						>
							fermer
						</button>
						<confirm-button
							v-if="!props.noDelete"
							class="btn-delete btn-xs"
							@confirm="deleteBlock"
						>
							supprimer
						</confirm-button>
					</div>
				</div>

				<move-item-to
					:source-id="theBlock.id"
					source="block"
					target="post"
					@moved="emits('update:modelValue', false)"
				/>

				<div class="flex justify-between items-baseline w-full">
					<form-maker
						type="switch"
						v-show="!props.noBlur"
						v-model="theBlock.blur"
						label="Bloc flouté,Bloc visible"
						name="blur"
						sm
					/>

					<div class="flex items-baseline gap-5">
						<label>
							visibilité alternative
							<input
								v-model="switchEnable"
								type="checkbox"
								@click="updateSwitchEnable"
							>
						</label>

						<form-maker
							type="switch"
							v-show="!props.noSwitch && switchEnable"
							v-model="theBlock.switch"
							label="Bloc visible, block caché"
							name="switch"
							sm
						/>
					</div>
				</div>
			</div>
		</template>

		<div class="w-full px-5">
			<div :class="props.overflowScroll ? 'overflow-y-auto' : ''">
				<!-- data to be displayed -->
				<div
					:class="
						props.previewCol || props.noPreview
							? ''
							: 'md:grid-cols-2'
					"
					class="grid grid-cols-1 gap-5"
				>
					<div class="mt-2">
						<form-maker
							v-show="!props.noTitle"
							v-model="theBlock.title"
							label="titre"
							label-class="uppercase"
							type="text"
							with-icon
						/>

						<div
							v-show="!props.noType"
							class="flex flex-wrap gap-2 justify-between mt-1"
						>
							<button
								v-for="(item, key) in postType"
								:key="key"
								:class="
									key === theBlock.type ? 'is-active' : ''
								"
								class="btn btn-xs"
								@click="
									theBlock.type =
										theBlock.type === key ? '' : key
								"
							>
								{{ item.title }}
							</button>
						</div>

						<form-maker
							ref="formBody"
							type="code"
							v-model="theBlock.body"
							:rows="11"
							label="corps"
							language="latex"
						/>
						<div class="text-xs font-code">
							@posts.show,[id] | @blocks.show,[id] | #[item-id]<br>
							.@text .@bg pour des classes à thème
						</div>

						<div
							class="mt-3"
							v-if="!props.noGrid"
						>
							<form-maker
								v-model="theBlock.template"
								label="disposition"
								label-class="uppercase"
								sm
								type="text"
							/>
							<p class="text-xs flex gap-3">
								<button
									class="btn btn-xs"
									@click="theBlock.template = 'bi,md:3b+2i'"
								>
									bi,md:3b+2i
								</button>
								<button
									class="btn btn-xs"
									@click="
										theBlock.template = 'bi,md:b+i,lg:3b+2i'
									"
								>
									bi,md:b+i,lg:3b+2i
								</button>
							</p>
						</div>
					</div>

					<div
						v-if="!props.noPreview"
						class="pt-8 pb-3 px-3"
					>
						<div class="w-full flex justify-end gap-3 mb-2">
							<BlockBodyButtons
								:buttons="blockButtons"
								v-model="random"
							/>
						</div>

						<div class="max-h-[50vh] overflow-y-auto">
							<markdown-it
								:text="blockBody"
								class="p-3 bg-gray-100 border border-dashed border-gray-200 h-full"
							/>
						</div>
					</div>
				</div>

				<div
					v-show="!props.noScript || !props.noData"
					class="grid grid-cols-1 md:grid-cols-2 gap-3"
				>
					<form-maker
						v-show="!props.noScript"
						v-model="theBlock.script"
						label="script"
						type="code"
						:rows="8"
						language="javascript"
					/>

					<form-maker
						v-show="!props.noData"
						v-model="theBlock.json"
						type="textarea"
						:rows="8"
						label="data"
						name="json"
					/>
				</div>
			</div>
		</div>
	</dialog-modal>
</template>
