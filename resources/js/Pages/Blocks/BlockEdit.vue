<script lang="ts" setup>
import BlockShow from "@/Components/Blocks/BlockShow.vue"
import FormMaker from "@/Components/Form/FormMaker.vue"
import MoveItemTo from "@/Components/MoveItemTo.vue"
import SplitView from "@/Components/SplitView.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import LayoutMain from "@/Layouts/LayoutMain.vue"
import {blockTypes} from "@/block.config.ts"
import {flashInterface} from "@/types"
import type {BlockInterface} from "@/types/modelInterfaces"
import {router} from "@inertiajs/vue3"
import axios from "axios"
import {computed, inject, ref, unref} from "vue"
import ScButton from "@/Components/Ui/scButton.vue"

defineOptions({layout: LayoutMain})

const props = defineProps<{
	block: BlockInterface
}>()

const displayStyle = ref<"side-by-side" | "editor" | "preview">("side-by-side")
const flash = inject<flashInterface>("flash")
const tab = ref<"markdown" | "script" | "data">("markdown")

const theBlock = ref<BlockInterface>(props.block)

const originalBlock = unref({...props.block})

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
	router.visit(route("blocks.show", {block: theBlock.value.id}))
}

function saveBlock() {
	axios
		.post(route("api.admin.blocks.update", [theBlock.value.id]), {
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
	const block_id = theBlock.value.id

	axios.get(route("api.admin.blocks.blockable.url", {block: block_id}))
		.then((res) => {
			console.log(res.data)
			axios
				.post(route("api.admin.blocks.destroy", [theBlock.value.id]), {
					_method: "delete"
				})
				.then(() => {
					flash.add("Le block a été supprimé")

					// Go to the blockable item.
					router.visit(res.data)

				})
				.catch((error) => console.error(error))
		})

}

function addIllustration() {
	axios
		.post(
			route("api.admin.blocks.illustrations.store", {block: theBlock.value.id}),
			{}
		)
		.then((res) => {
			router.visit(route("admin.illustrations.edit", [res.data.id]))
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

function deleteIllustration(id: number) {
	axios
		.post(route("api.admin.illustrations.destroy", [id]), {
			_method: "delete"
		})
		.then(() => {
			flash.add("L'illustration a été supprimée")
			// Go to the post.
			theBlock.value.illustrations = theBlock.value.illustrations.filter(x => x.id !== id)
		})
		.catch((error) => console.error(error))
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
				<sc-button
					type="save"
					:class="wasEdited ? '' : 'invisible'"
					@click="saveBlock"
					xs
				>
					<i class="bi bi-save" />
				</sc-button>

				<sc-button
					:class="wasEdited ? '' : 'invisible'"
					type="save"
					xs
					@click="blockSaveAndVisit"
				>
					<i class="bi bi-save mr-1" /> et visiter
				</sc-button>

				<sc-button
					xs
					@click="visitBlock"
				>
					visiter
				</sc-button>
				<confirm-button
					@confirm="deleteBlock"
					xs
				>
					supprimer
				</confirm-button>
			</div>
		</header>

		<!-- editor and preview -->
		<main>
			<div
				class="flex gap-3"
			>
				<!-- Titre et type du block -->
				<div
					v-if="displayStyle === 'side-by-side' || displayStyle === 'editor'"
					class="flex-1"
				>
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
						class="grid gap-2 mt-2 grid-cols-4"
						:class="{
							'md:grid-cols-8': displayStyle==='editor',
						}"
					>
						<sc-button
							v-for="(item, key) in blockTypes"
							:key="key"
							:class="key !== theBlock.type ? blockTypes[key].style.body : blockTypes[key].style.header"
							xs
							@click="theBlock.type = theBlock.type === key ? '' : key"
						>
							{{ item.title }}
						</sc-button>
					</div>
				</div>

				<!-- gestion des illustrations -->
				<div
					v-if="displayStyle === 'side-by-side' || displayStyle === 'preview'"
					class="space-y-3 flex-1"
				>
					<h3 class="font-extralight">
						illustrations
					</h3>
					<form-maker
						v-model="theBlock.illustrationsGrid"
						class="flex-1"
						input-class="rounded-r-none"
						label="wrapper class"
						label-class="w-[120px]"
						sm
						inline-label
						type="text"
					>
						<template #message>
							<div class="text-xs">
								gère la grille englobant la ou les illustrations du block
							</div>
						</template>
					</form-maker>
					<div v-if="theBlock.illustrations.length>0">
						<ul class="list list-inside list-disc space-y-1">
							<li
								v-for="illustration in theBlock.illustrations"
								:key="illustration.id"
								class="flex justify-between items-baseline"
							>
								<span class="text-xs">id: {{
									illustration.id
								}} - {{ illustration.title ?? 'illustration sans titre' }}</span>
								<confirm-button
									xs
									@confirm="deleteIllustration(illustration.id)"
								>
									<i class="bi bi-trash" />
									<template #confirm>
										<i class="bi bi-hand-thumbs-up" />
									</template>
								</confirm-button>
							</li>
						</ul>
					</div>
					<sc-button
						type="add"
						class="w-full py-2"
						@click="addIllustration"
					>
						ajouter une illustration
					</sc-button>
				</div>
			</div>

			<div
				class="flex gap-3 mt-4"
			>
				<div
					v-if="displayStyle === 'side-by-side' || displayStyle === 'editor'"
					class="w-full h-full flex-1"
				>
					<div>
						<!-- corps et preview -->
						<div class="relative">
							<div class="absolute right-0 top-[-1.3em] flex text-xs z-10">
								<button
									:class="{ 'bg-blue-600 text-white': tab === 'markdown' }"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab = 'markdown'"
								>
									markdown
								</button>
								<button
									:class="{ 'bg-blue-600 text-white': tab === 'script' }"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab = 'script'"
								>
									script
								</button>
								<button
									:class="{ 'bg-blue-600 text-white': tab === 'data' }"
									class="border-x border-t px-2 py-0 rounded-t transition-all duration-500"
									@click="tab = 'data'"
								>
									data
								</button>
							</div>

							<form-maker
								v-show="tab === 'markdown'"
								ref="formBody"
								v-model="theBlock.body"
								:rows="20"
								label="corps"
								language="latex"
								type="codearea"
							/>
							<div v-show="tab === 'script'">
								<form-maker
									v-model="theBlock.script"
									:rows="20"
									label="script"
									language="javascript"
									type="codearea"
								/>
								<div class="flex">
									<button @click="addScriptsButtons">
										ajouter des boutons
									</button>
								</div>
							</div>
							<form-maker
								v-show="tab === 'data'"
								v-model="theBlock.json"
								:rows="20"
								language="json"
								type="codearea"
							/>
						</div>
					</div>

					<div class="h-[3.2em] font-code text-xs px-3">
						<div v-show="tab === 'markdown'">
							@posts.show,[id] | @blocks.show,[id] | #[item-id]<br>
							.@text .@bg .@def pour des classes à thème
						</div>
					</div>
				</div>


				<block-show
					v-if="displayStyle === 'side-by-side' || displayStyle === 'preview'"
					:block="theBlock"
					class="flex-1"
					no-admin
				/>
			</div>
		</main>
	</article>
</template>
