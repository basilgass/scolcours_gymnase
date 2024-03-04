<!--
Formulaire d'édition d'un bloc
-->
<script setup lang="ts">
import { computed, PropType, ref } from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import { blockTypes } from "@/scolcours"
import MoveItemTo from "@/Components/Posts/MoveItemTo.vue"
import { useBlock } from "@/Components/Posts/Blocks/useBlock"
import BlockBodyButtons from "@/Components/Posts/Blocks/BlockBodyButtons.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import axios from "axios"
import { BlockInterface } from "@/types/modelInterfaces"
import { useCycleList, useMagicKeys, whenever } from "@vueuse/core"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
	const props = defineProps({
		block: { type: Object as PropType<BlockInterface>, required: true },
		modelValue: { type: Boolean, default: false },
		switch: { type: Boolean },
		noTitle: { type: Boolean, default: false },
		noType: { type: Boolean, default: false },
		noSwitch: { type: Boolean, default: false },
		noScript: { type: Boolean, default: false },
		noData: { type: Boolean, default: false },
		noBlur: { type: Boolean, default: false },
		noDelete: { type: Boolean, default: false },
		noGrid: { type: Boolean, default: false },
		noPreview: { type: Boolean, default: false },
		previewCol: { type: Boolean, default: false },
		overflowScroll: { type: Boolean, default: false },
	})

	const show = ref(props.modelValue),
		theBlock = ref<BlockInterface>(props.block),
		switchEnable = ref(props.block.switch !== null)

	const { blockBody, blockButtons, random } = useBlock(theBlock.value)

	const updateSwitchEnable = function () {
		if (switchEnable.value) {
			theBlock.value.switch = false
		} else {
			theBlock.value.switch = null
		}
	}

	const saveBlock = function () {
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
				.then(() => {
					emits("update:modelValue", false)
					emits("destroy", props.block.id)
				})
				.catch((error) => console.error(error))
		}

	const postType = blockTypes

const tabs = useCycleList(['markdown', 'script', 'data'])
const tab = computed(()=>tabs.state.value)
const keys = useMagicKeys({
	passive: false,
	onEventFired(e) {
		if(e.ctrlKey && (e.key==='<'||e.key==='>')) {
			e.preventDefault()
		}
	},
})
const CtrlTab = keys['Ctrl+<']
const CtrlTabReverse = keys['Ctrl+>']

whenever(CtrlTab, () => {
	tabs.next()
})
whenever(CtrlTabReverse, () => {
	tabs.prev()
})
</script>

<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50 max-h-[90vh] min-h-[90vh]"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white border-b border-gray-200 px-5 py-3 flex flex-col gap-3">
				<!-- titre et boutons de contrôle -->
				<div
					class="flex flex-col md:flex-row gap-3
				justify-between items-baseline w-full"
				>
					<h1 class="flex items-baseline gap-5">
						<span class="text-xl md:text-2xl">
							édition d'un block</span>
						<span class="text-xs font-code">
							(id: {{ theBlock.id }})</span>
					</h1>
					<div class="flex gap-3 justify-end">
						<move-item-to
							:source-id="theBlock.id"
							source="block"
							target="post"
							@moved="emits('update:modelValue', false)"
						/>
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

				<!-- Mise  en page du block -->
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

		<template #footer>
			<div class="h-[3.2em] font-code text-xs px-3">
				<div v-show="tab==='markdown'">
					@posts.show,[id] | @blocks.show,[id] | #[item-id]<br>
					.@text .@bg pour des classes à thème
				</div>
			</div>
		</template>
		<div class="w-full h-full px-5 py-2">
			<div
				:class="props.overflowScroll ? 'overflow-y-auto' : 'h-full'"
			>
				<!-- Titre et type du block -->
				<div>
					<form-maker
						v-show="!props.noTitle"
						v-model="theBlock.title"
						label="titre"
						label-class="uppercase"
						type="text"
						inline-label
						sm
					/>

					<!-- Boutons pour les types de blocks -->
					<div
						v-show="!props.noType"
						class="grid grid-cols-6 gap-2 mt-2"
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
				</div>

				<!-- corps et preview -->
				<div
					:class=" props.previewCol || props.noPreview ? '' : 'md:grid-cols-2'"
					class="grid grid-cols-1 gap-5"
				>
					<div class="mt-4 relative">
						<div class="absolute right-0 top-[0.6em] flex text-xs ">
							<button
								class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
								:class="{'bg-blue-600 text-white':tab==='markdown'}"
								@click="tabs.state.value='markdown'"
							>
								markdown
							</button>
							<button
								v-show="!props.noScript"
								class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
								:class="{'bg-blue-600 text-white':tab==='script'}"
								@click="tabs.state.value='script'"
							>
								script
							</button>
							<button
								v-show="!props.noData"
								class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
								:class="{'bg-blue-600 text-white':tab==='data'}"
								@click="tabs.state.value='data'"
							>
								data
							</button>
						</div>

						<div>
							<form-maker
								v-show="tab==='markdown'"
								ref="formBody"
								type="code"
								v-model="theBlock.body"
								label="corps"
								:rows="20"
								language="latex"
							/>
							<form-maker
								v-show="tab==='script'"
								v-model="theBlock.script"
								label="script"
								type="code"
								:rows="20"
								language="javascript"
							/>
							<form-maker
								v-show="tab==='data'"
								v-model="theBlock.json"
								type="textarea"
								:rows="20"
								label="data"
								language="json"
							/>
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
			</div>
		</div>
	</dialog-modal>
</template>
