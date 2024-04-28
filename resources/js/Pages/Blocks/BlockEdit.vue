<script lang="ts" setup>
import LayoutMain from "@/Layouts/LayoutMain.vue"
import { computed, inject, PropType, ref, unref } from "vue"
import type { BlockInterface } from "@/types/modelInterfaces"
import BlockShow from "@/Pages/Blocks/BlockShow.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import { router } from "@inertiajs/vue3"
import axios from "axios"
import { flashInterface } from "@/types"
import SplitView from "@/Components/SplitView.vue"
import { blockTypes } from "@/scolcours"

defineOptions({ layout: LayoutMain })

const props = defineProps({
	"block": {
		type: Object as PropType<BlockInterface>,
		required: true
	}
})

const displayStyle = ref<"side-by-side" | "editor" | "preview">("side-by-side")

const flash = inject<flashInterface>("flash")
const tab = ref<"markdown" | "script" | "data">("markdown")

const theBlock = ref<BlockInterface>(props.block)

const originalBlock = unref({ ...props.block })
const wasEdited = computed(() => {
	return originalBlock.title !== theBlock.value.title
		|| originalBlock.body !== theBlock.value.body
		|| originalBlock.script !== theBlock.value.script
		|| originalBlock.json !== theBlock.value.json
		|| originalBlock.type !== theBlock.value.type
		|| originalBlock.template !== theBlock.value.template
		|| originalBlock.illustrationsGrid !== theBlock.value.illustrationsGrid
		|| originalBlock.illustrations.length !== theBlock.value.illustrations.length
})


function visitBlock() {
	// Check if the block has been modified
	router.visit(route("blocks.show", [theBlock.value.id]))
}

function saveBlock() {
	axios
		.post(route("blocks.update", [theBlock.value.id]), {
			...theBlock.value,
			_method: "PATCH"
		})
		.then(() => {
			flash.success("Block enregistré")
		})
		.catch((error) => {
			flash.error("Erreur lors de l'enregistrement<br/>" + error.response.data.message)
			console.error(error)
		})
}

function deleteBlock() {
	axios
		.post(route("blocks.destroy", [theBlock.value.id]), {
			_method: "delete"
		})
		.then((res) => {
			flash.add("Le block a été supprimé")
			// Go to the post.
			router.visit(res.data)

		})
		.catch((error) => console.error(error))
}

function addIllustration() {
	axios
		.post(
			route("illustrations.store", [theBlock.value.id]),
			{}
		)
		.then((res) => {
			router.visit(route("illustrations.edit", [res.data.id]))
			flash.success("une nouvelle illustration a été créée")
		}).catch((res) => {
			console.warn("add illustration: ", res)
		}
	)
}

function blockSaveAndVisit() {
	saveBlock()
	visitBlock()
}

function addScriptsButtons() {
	let script = theBlock.value.script.trim()

	script = script.slice(0, script.length - 1) +
		`,\n\tbtn: {
		reset: {
			icon: 'bi bi-trash',
			text: 'reset'
		},
		random: {
			icon: 'bi bi-shuffle',
			text: 'aléatoire'
		}
	}` + '\n}'

	theBlock.value.script = script
}
</script>

<template>
	<article class="my-5 scolcours-container">
		<!-- split view system -->
		<split-view v-model="displayStyle" />

		<!-- header -->
		<header class="mb-5 flex justify-between">
			<div>
				<div class="text-3xl">
					édition d'un bloc
				</div>
				<move-item-to
					:source-id="theBlock.id"
					source="block"
					target="post"
				/>
			</div>
			<div class="self-start grid grid-cols-2 gap-2 items-center flex-wrap">
				<button
					:class="wasEdited?'':'invisible'"
					class="btn-primary btn-xs"
					@click="saveBlock"
				>
					<i class="bi bi-save" />
				</button>

				<button
					:class="wasEdited?'':'invisible'"
					class="btn-primary btn-xs"
					@click="blockSaveAndVisit"
				>
					<i class="bi bi-save mr-1" /> et visiter
				</button>

				<button
					class="btn-cancel btn-xs"
					@click="visitBlock"
				>
					visiter
				</button>
				<confirm-button
					class="btn-delete btn-xs"
					@confirm="deleteBlock"
				>
					supprimer
				</confirm-button>
			</div>
		</header>

		<!-- editor and preview -->
		<main>
			<div
				:class="{
					'grid-cols-2': displayStyle === 'side-by-side',
					'grid-cols-1': displayStyle !== 'side-by-side'
				}"
				class="grid gap-3"
			>
				<!-- Titre et type du block -->
				<div v-if="displayStyle === 'side-by-side' || displayStyle === 'editor'">
					<form-maker
						v-model="theBlock.title"
						inline-label
						label="titre"
						label-class="uppercase"
						sm
						type="text"
					/>

					<!-- Boutons pour les types de blocks -->
					<div
						class="grid grid-cols-6 gap-2 mt-2"
					>
						<button
							v-for="(item, key) in blockTypes"
							:key="key"
							:class=" key === theBlock.type ? 'is-active' : 'bg-white'"
							class="btn btn-xs overflow-clip !px-0"
							@click="theBlock.type = theBlock.type === key ? '' : key"
						>
							{{ item.title }}
						</button>
					</div>
				</div>

				<!-- gestion des illustrations -->
				<div v-if="displayStyle === 'side-by-side' || displayStyle === 'preview'">
					<div class="flex">
						<form-maker
							v-model="theBlock.illustrationsGrid"
							class="flex-1"
							inline-label
							input-class="rounded-r-none"
							label="ILLUSTRATION"
							label-class="w-[110px]"
							sm
							type="text"
						/>
						<button
							class="btn btn-add btn-xs rounded-l-none"
							@click="addIllustration"
						>
							<i class="bi bi-plus-lg" />
						</button>
					</div>
				</div>
			</div>

			<div
				:class="{
					'grid-cols-2': displayStyle === 'side-by-side',
					'grid-cols-1': displayStyle !== 'side-by-side'
				}"
				class="grid gap-3 mt-4"
			>
				<div
					v-if="displayStyle === 'side-by-side' || displayStyle === 'editor'"
					class="w-full h-full"
				>
					<div>
						<!-- corps et preview -->
						<div class="relative">
							<div class="absolute right-0 top-[0.6em] flex text-xs z-10">
								<button
									:class="{'bg-blue-600 text-white':tab==='markdown'}"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab='markdown'"
								>
									markdown
								</button>
								<button
									:class="{'bg-blue-600 text-white':tab==='script'}"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab='script'"
								>
									script
								</button>
								<button
									:class="{'bg-blue-600 text-white':tab==='data'}"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab='data'"
								>
									data
								</button>
							</div>

							<div>
								<form-maker
									v-show="tab==='markdown'"
									ref="formBody"
									v-model="theBlock.body"
									:rows="20"
									label="corps"
									language="latex"
									type="code"
								/>
								<div v-show="tab==='script'">
									<form-maker
										v-model="theBlock.script"
										:rows="20"
										label="script"
										language="javascript"
										type="code"
									/>
									<div class="flex">
										<button @click="addScriptsButtons">
											ajouter des boutons
										</button>
									</div>
								</div>
								<form-maker
									v-show="tab==='data'"
									v-model="theBlock.json"
									:rows="20"
									label="data"
									language="json"
									type="textarea"
								/>
							</div>
						</div>
					</div>

					<div class="h-[3.2em] font-code text-xs px-3">
						<div v-show="tab==='markdown'">
							@posts.show,[id] | @blocks.show,[id] | #[item-id]<br>
							.@text .@bg pour des classes à thème
						</div>
					</div>
				</div>


				<block-show
					v-if="displayStyle === 'side-by-side' || displayStyle === 'preview'"
					:block="theBlock"
				/>
			</div>
		</main>
	</article>
</template>

