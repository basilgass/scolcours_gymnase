<template>
	<article
		class="relative"
		:class="($page.props.auth.can.admin && editMode)?'border border-dashed border-amber-600 rounded -mx-4 pt-2 pb-2 px-4':''"
	>
		<!-- Edit mode the block -->
		<dialog-modal
			v-model="edit"
		>
			<block-form
				ref="bForm"
				v-model="crtBlock"
				:switch="props.switch"
				@close="edit=false"
			/>
		</dialog-modal>

		<!-- Admin buttons -->
		<div
			v-if="$page.props.auth.can.admin && editMode"
			class="admin-wrapper mb-5 flex-col"
		>
			<div class="w-full flex flex-row justify-between">
				<div class="space-x-3">
					<button
						class="btn-edit btn-xs"
						@click="edit=true"
					>
						éditer <i class="bi bi-pencil" />
					</button>

					<confirm-button
						v-if="!hideDelete"
						xs
						btn-class="btn-delete"
						@confirm="destroyBlock"
					>
						supprimer <i class="bi bi-trash" />
					</confirm-button>
				</div>

				<div class="space-x-3">
					<button
						v-if="!hideBlur"
						class="btn btn-xs px-5"
						@click="blurBlock"
					>
						<i
							class="bi bi-eye"
							:class="dbBlur?'blur-sm':''"
						/>
					</button>
					<button
						v-if="props.switch"
						class="btn-xs px-5"
						:class="{
							'text-white bg-orange-700': crtBlock.switch===0,
							'text-white bg-blue-700': crtBlock.switch===1
						}"
						@click="switchBlock"
					>
						<i class="bi bi-toggle-off" />
					</button>
				</div>
			</div>

			<div
				v-if="$slots.admin"
				class="w-full"
			>
				<slot name="admin" />
			</div>
		</div>

		<!-- display mode of the block -->
		<!-- display the block faded or not -->
		<div
			class="relative"
			:class="blockTypeClass"
		>
			<div
				class="transition-all "
				:class="{ 'blur-sm':crtBlock.blur }"
			>
				<!-- Header of the block -->
				<div class="flex gap-5">
					<div
						v-katex.auto="crtBlock.title"
						class="text-lg flex-1"
					/>

					<button
						v-if="crtBlock.script"
						class="btn btn-xs bg-white hover:bg-blue-400 hover:border-blue-500 hover:text-white"
						@click="runBlockScript()"
					>
						<i class="bi bi-shuffle mr-2" />Rendre aléatoire
					</button>
				</div>

				<!-- Body of the block -->
				<markdown-it
					:text="editedBody"
					@dblclick.prevent="toggleBlockEdition"
				/>

				<!-- Illustration of the block -->
				<div
					v-if="crtBlock.illustrations.length>0"
					class="grid grid-cols-1 mt-8 mb-4 gap-4"
					:class="{
						'md:grid-cols-2 xl:grid-cols-3': crtBlock.illustrations.length>=2,
						'xl:grid-cols-2': crtBlock.illustrations.length===2,
						'max-w-lg mx-auto': crtBlock.illustrations.length===1
					}"
				>
					<illustration-show
						v-for="illustration in crtBlock.illustrations"
						:key="illustration.id"
						:illustration="illustration"
					/>
				</div>
			</div>
			<div
				v-show="crtBlock.blur"
				class="absolute top-0 h-full left-0 w-full bg-white/30"
			>
				<button
					class="w-full h-full text-3xl hover:scale-125 transition-all duration-300"
					@click="crtBlock.blur=false"
				>
					<i class="bi bi-eye" />
				</button>
			</div>
		</div>
	</article>
</template>

<script setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt"
import {computed, inject, nextTick, onMounted, provide, ref, watch} from "vue"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import {PiMath} from "pimath/esm"
import DialogModal from "@/Components/Ui/DialogModal"
import BlockForm from "@/Components/Posts/Blocks/BlockForm"
import ConfirmButton from "@/Components/Ui/ConfirmButton"

const $emits = defineEmits(["delete", "updated"])
const props = defineProps({
	block: {
		type: Object, default: () => {
		}
	},
	switch: {type: Boolean},
	hideBlur: {type:Boolean, default:false},
	hideDelete: {type:Boolean, default:false},
	hasPadding: {type: Boolean, default: false}
})

let editMode = inject("editpost")

/** Script result coming from the post (random or not) */
let postScriptResult = inject("postScriptResult"),
	runBlockScript =async function () {
		if (crtBlock.value.script !== null) {
			let F = new Function("PiMath", "postScript", crtBlock.value.script)
			await nextTick()
			blockScriptResult.value = F(PiMath, postScriptResult.value)
		}
	},
	blockScriptResult = ref({}),
	scriptsResult = computed(()=>{
		return {...postScriptResult.value, ...blockScriptResult.value}
	})

provide("blockScriptResult", scriptsResult)
watch(postScriptResult, ()=>{
	runBlockScript()
})
onMounted(() => runBlockScript())

let edit = ref(props.block.isNew === true),
	crtBlock = ref(props.block),
	dbBlur = ref(props.block.blur),
	bForm = ref(null),
	blockTypeClass = computed(()=>{
		if(crtBlock.value.type===""){return props.hasPadding?"-mx-4 px-4":""}
		return `${props.hasPadding?"-mx-4 px-4":""} block-border-${crtBlock.value.type}`
	})


async function toggleBlockEdition(){
	if(editMode.value && edit.value===false){
		edit.value = true
		await nextTick()
		bForm.value.focus(true)
	}
}


let editedBody = computed(() => {
	// There is no value for the script
	if(scriptsResult.value === {})return crtBlock.value.body

	// Edit the output
	let output = crtBlock.value.body
	for (let key in scriptsResult.value) {
		output = output.replaceAll("$" + key, scriptsResult.value[key])
	}

	// Rename all "unwanted" double signs.
	// - - => +
	// + -  or  - + => -
	// + + => +
	output = output.replaceAll("--", "+")
	output = output.replaceAll("++", "+")
	output = output.replaceAll("-+", "-")
	output = output.replaceAll("+-", "-")

	return output
})

function blurBlock() {
	// Update the blur
	dbBlur.value = !dbBlur.value
	if (dbBlur.value !== crtBlock.value.blur) {
		crtBlock.value.blur = dbBlur.value
	}

	// Update the database
	axios.post(
		route("blocks.blur", [crtBlock.value.id]),
		{
			blur: dbBlur.value,
			_method: "patch"
		}
	)
}

function switchBlock(){
	if(props.switch) {
		if(crtBlock.value.switch===null){
			crtBlock.value.switch = 0
		}else if (crtBlock.value.switch===0){
			crtBlock.value.switch = 1
		}else{
			crtBlock.value.switch = null
		}

		axios.post(
			route("blocks.switch", [crtBlock.value.id]),
			{
				switch: crtBlock.value.switch,
				_method: "patch"
			}
		)
	}
}

function destroyBlock() {
	$emits("delete", crtBlock.value.id)
	axios.post(
		route("blocks.destroy", [crtBlock.value.id]),
		{_method: "delete"}
	).catch(err => console.log(err))
}

</script>
