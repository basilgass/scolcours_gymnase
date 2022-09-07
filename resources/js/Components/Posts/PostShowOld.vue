<template>
	<div ref="root">
		<chapter-article>
			<template #title>
				{{ postTitle }}
			</template>
			<template
				v-if="$page.props.auth.can.admin && editMode"
				#options
			>
				<!-- update the number of visible blocks -->
				<div class="flex justify-end items-baseline mb-10">
					<div class="flex items-baseline">
						<form-label
							class="mr-2"
							name="visibleBlocks"
							label="Nombre de blocs visibles"
							@click.ctrl="numberVisibleBlocks=0;updateNumberOfVisibleBlocks()"
						/>
						<form-number
							v-model="numberVisibleBlocks"
							name="visibleBlocks"
							label="Nombre de blocs visibles"
							inline
							class="w-12"
							@input="updateNumberOfVisibleBlocks"
						/>
					</div>
					<div class="ml-5 flex gap-3">
						<button
							class="btn-edit btn-xs"
							@click="edit=true"
						>
							éditer <i class="bi bi-pencil" />
						</button>
						<button
							class="btn-delete btn-xs"
							@click="deletePost"
						>
							Supprimer <i class="bi bi-trash" />
						</button>
					</div>
				</div>
			</template>

			<!-- Edit box -->
			<dialog-modal
				v-model="edit"
				@cancel="numberVisibleBlocks = props.post.numberOfVisibleBlocks"
			>
				<PostForm
					:post="post"
					@validate="refreshPost"
					@cancel="edit=false;numberVisibleBlocks = props.post.numberOfVisibleBlocks"
				/>
			</dialog-modal>


			<!-- Main body content -->
			<div class="post-wrapper">
				<!-- Boutons générés par rapport au scritp du post -->
				<div class="post-header flex justify-end mt-2 mb-5">
					<button
						v-if="scriptParameters?.random===true"
						class="btn btn-xs bg-white hover:bg-blue-400 hover:border-blue-500 hover:text-white"
						@click="runPostScript()"
					>
						<i class="bi bi-shuffle mr-2" />Rendre aléatoire
					</button>
					<div
						v-if="props.post.switch"
						class="ml-10"
					>
						<span v-katex.auto="scriptSwitchPreText" />
						<ui-switch
							v-model="scriptSwitch"
							sm
							class="mx-1"
						/>
						<span v-katex.auto="scriptSwitchPostText" />
					</div>
				</div>

				<!-- Visible blocks by default -->
				<div
					v-if="visibleBlocks.length>0"
					class="space-y-6"
				>
					<block-show
						v-for="block in visibleBlocks"
						:key="block.id"
						:script="scriptParameters"
						:switch="scriptSwitch"
						:block="block"
						@delete="deleteBlock(block.id)"
					/>
				</div>
				<!-- hidden blocks by default -->
				<div v-if="hiddenBlocks.length>0">
					<div
						v-if="!showHiddenBlocks"
						class="text-center mt-6 mb-4 pt-5 border-t border-gray-200"
					>
						<button
							class="btn text-gray-500 italic text-xs"
							@click="showHiddenBlocks=true"
						>
							Développer la suite...
						</button>
					</div>

					<collapse-transition>
						<div
							v-show="showHiddenBlocks"
							class="space-y-6"
						>
							<block-show
								v-for="block in hiddenBlocks"
								:key="block.id"
								:script="scriptParameters"
								:switch="scriptSwitch"
								:block="block"
								@delete="deleteBlock(block.id)"
							/>
						</div>
					</collapse-transition>
				</div>
			</div>

			<!-- footer for admin -->
			<div v-if="$page.props.auth.can.admin && editMode">
				<div class="border-t mt-5 pt-3 pb-2">
					<button
						class="btn-primary"
						@click="addBlock"
						v-text="`ajouter ${addNBlocks} bloc${addNBlocks>1?'s':''}`"
					/>
					<form-number
						v-model="addNBlocks"
						name="addNBlock"
						label="nombre de blocs à ajouter"
						min="1"
						max="10"
					/>
				</div>
			</div>
		</chapter-article>
	</div>
</template>

<script setup>

import {computed, inject, onMounted, ref} from "vue"
import ChapterArticle from "@/Components/Ui/Chapters/ChapterArticle"
import BlockShow from "@/Components/Posts/Blocks/BlockShow"
import FormNumber from "@/Components/Form/FormNumber"
import CollapseTransition from "@/Components/CollapseTransition"
import PostForm from "@/Components/Posts/PostForm"
import {PiMath} from "pimath/esm"
import UiSwitch from "@/Components/Ui/UiSwitch"
import DialogModal from "@/Components/Ui/DialogModal"
import FormLabel from "@/Components/Form/FormLabel"
import {usePage} from "@inertiajs/inertia-vue3"

const emits = defineEmits(["delete","updateTitle"])
const props = defineProps({
	post: {
		type: Object, default: () => {
		}
	}
})

let editMode = inject("editmode")

let root = ref(null),
	edit = ref(props.post.isNew===true),
	postTitle = ref(props.post.title),
	blocks = ref(props.post.blocks),
	numberVisibleBlocks = ref(props.post.numberOfVisibleBlocks),
	showHiddenBlocks = ref(false),
	scriptParameters = ref({}),
	scriptSwitch = ref(props.post.switch!==null),
	addNBlocks = ref(1)

onMounted(()=>{
	runPostScript()
})

function runPostScript(){
	if(props.post.script!==null) {
		let F = new Function("PiMath", props.post.script)
		scriptParameters.value = F(PiMath)
	}
}

let scriptSwitchPreText = computed(()=>{
	if(props.post.switch===null){return ""}
	if(props.post.switch.includes("@")){
		return props.post.switch.split("@")[0]
	}else{
		return props.post.switch
	}
})
let scriptSwitchPostText = computed(()=>{
	if(props.post.switch===null){return ""}
	if(props.post.switch.includes("@")){
		return props.post.switch.split("@")[1]
	}else{
		return ""
	}
})

let visibleBlocks = computed(()=>{
	// First, get the visible blocks
	let result = []

	if(numberVisibleBlocks.value===0){
		result = blocks.value
	}else{
		result = [...blocks.value].splice(0, numberVisibleBlocks.value)
	}

	if(!usePage().props.value.auth.can.admin){
		result = result.filter(block=>props.post.switch===null || block.switch===null || Boolean(block.switch)===scriptSwitch.value)
	}

	return result

	// if(numberVisibleBlocks.value===0){
	// 	return blocks.value.filter(block=>props.post.switch===null || block.switch===null || Boolean(block.switch)===scriptSwitch.value)
	// }else{
	// 	return [...blocks.value.filter(block=>props.post.switch===null || block.switch===null || Boolean(block.switch)===scriptSwitch.value)].splice(0, numberVisibleBlocks.value)
	// }
})
let hiddenBlocks = computed(()=>{
	if(numberVisibleBlocks.value===0){
		return []
	}else{
		return [...blocks.value.filter(block=>props.post.switch===null || block.switch===null || Boolean(block.switch)===scriptSwitch.value)].splice(numberVisibleBlocks.value)
	}
})

function refreshPost(item){
	postTitle.value = item.title
	emits("updateTitle", item.title)
	edit.value = false
}

function updateNumberOfVisibleBlocks(){
	axios.post(
		route("posts.updateNumberOfVisibleBlocks", [props.post.id]),
		{
			"numberVisibleBlocks": numberVisibleBlocks.value,
			_method: "patch"
		}
	).then(res => {
		// TODO: Send flash message ?
	})
}

function deletePost() {
	axios.post(route("posts.destroy", [props.post.id]),
		{_method: "delete"})
		.then(res => emits("delete", props.post.id))
}

function addBlock() {
	if(addNBlocks.value>=0) {
		axios.post(
			route("posts.blocks.store", [props.post.id]),
			{
				n: addNBlocks.value
			}
		).then(res => {
			// Set the first block in edit mode.
			res.data[0].isNew = true
			for(let b of res.data){
				blocks.value.push(b)
			}
		}).catch(err => {
			console.error(err)
		})
	}
}

function deleteBlock(id) {
	blocks.value = blocks.value.filter(block => block.id !== id)
}

</script>
