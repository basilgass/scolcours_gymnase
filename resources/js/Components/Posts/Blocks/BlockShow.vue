<template>
	<article
		v-show="showBlock"
		:class="theBlock.type!==''?`block-border-${theBlock.type}`:''"
		class="px-5"
	>
		<!-- Block title (if exist) -->
		<div class="flex justify-between w-full">
			<h3
				v-katex.auto="blockTitle"
				class="font-semibold"
			/>

			<div class="flex gap-3">
				<button
					v-if="theBlock.script"
					class="btn btn-xs"
					@click="random++"
				>
					aléatoire
				</button>

				<div
					v-admin
				>
					<button

						class="text-xs mr-2"
						@click="showEditForm=true"
					>
						{{ theBlock.id }} <i class="bi bi-pencil ml-2" />
					</button>

					<button
						class="draggable-handle text-xs px-1"
					>
						<i class="bi bi-arrows-move" />
					</button>
				</div>
			</div>
		</div>

		<!-- Block body -->
		<markdown-it :text="blockBody" />

		<!-- Block illustrations -->
		<div
			v-if="theBlock.illustrations.length"
			:class="{
				'md:grid-cols-2 xl:grid-cols-3': theBlock.illustrations.length>=2,
				'xl:grid-cols-2': theBlock.illustrations.length===2,
				'max-w-lg mx-auto': theBlock.illustrations.length===1
			}"
			class="grid grid-cols-1 mt-8 mb-4 gap-4"
		>
			<illustration-show
				v-for="illustration of theBlock.illustrations"
				:key="`block-${theBlock.id}-illustration-${illustration.id}`"
				:illustration="illustrationEdited(illustration)"
			/>
		</div>

		<div
			v-if="showEditForm"
			v-admin
		>
			<component
				:is="editForm"
				v-model="showEditForm"
				:block="theBlock"
				:max-illustration="maxIllustration"
				@change="updateBlock"
				@destroy="emits('destroy', $event)"
			/>
		</div>
	</article>
</template>

<script setup>

import MarkdownIt from "@/Components/Ui/MarkdownIt"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import {computed, defineAsyncComponent, inject, ref} from "vue"
import {PiMath} from "pimath/esm"
import {useFormattedBody} from "@/Composables/useHelpers"
import {useBlockTypes} from "@/scolcours"

const emits = defineEmits(["destroy"])
let props = defineProps({
		block: {type: Object, required: true},
		switch: {type: Boolean},
		maxIllustration: {type: Number, default: null}
	}),
	theBlock = ref(props.block),
	showBlock = computed(()=>{
		// if(usePage().props.value.auth.can.admin){return true}

		if(theBlock.value.switch===null){return true}
		return Boolean(theBlock.value.switch) === Boolean(props.switch)
	})

const blockTypes = useBlockTypes,
	blockTitle = computed(()=>{
		if(theBlock.value.title){
			return theBlock.value.title
		}

		if(blockTypes[theBlock.value.type]!==undefined){
			return blockTypes[theBlock.value.type].text
		}

		return ""
	})


let random = ref(1),
	postData = inject("postData", {}),
	blockData = computed(() => {
		try {
			if (props.block.script !== null && random.value>0) {
				let F = new Function("PiMath", "postData", props.block.script)
				return {...postData.value, ...F(PiMath, postData.value)}
			}
		}catch(e){
			console.log("BlockShow (script genration)", e)
		}

		return {...postData.value}
	}),
	blockBody = computed(() => {
		return useFormattedBody(props.block.body, blockData)
	}),
	illustrationEdited = function(illustration){
		return {
			id: illustration.id,
			title: illustration.title,
			type: illustration.type,
			code: useFormattedBody(illustration.code, blockData),
			parameters: illustration.parameters?useFormattedBody(illustration.parameters, blockData):""
		}
	}

let showEditForm = ref(props.block?.isNew===true),
	editForm = computed(()=>{
		return defineAsyncComponent(
			()=>import("@/Components/Posts/Blocks/BlockForm.vue")
		)
	}),
	updateBlock = function(b){
		theBlock.value = b
	}


</script>
