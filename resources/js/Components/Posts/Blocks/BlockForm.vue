<template>
	<dialog-modal
		v-model="show"
		class="bg-gray-50"
		@cancel="emits('update:modelValue', false)"
	>
		<template #header>
			<div class="bg-white border-b border-gray-200 px-5 py-3 mb-5">
				<div class=" flex justify-between items-baseline w-full">
					<h1>
						<span class="text-xl md:text-2xl">édition un block</span>
						<span class="text-xs font-code ml-5">(id: {{ theBlock.id }})</span>
					</h1>
					<div class="flex gap-3 justify-end">
						<button
							class="btn-primary btn-xs"
							@click="saveBlock"
						>
							enregistrer
						</button>
						<button
							class="btn-cancel btn-xs"
							@click="emits('update:modelValue', false)"
						>
							fermer
						</button>
						<confirm-button
							class="btn-delete btn-xs"
							@confirm="deleteBlock"
						>
							supprimer
						</confirm-button>
					</div>
				</div>

				<div class=" flex justify-between items-baseline w-full ">
					<form-switch
						v-show="!props.noBlur"
						v-model="theBlock.blur"
						label="Bloc flouté,Bloc visible"
						name="blur"
						sm
					/>

					<div>
						<input
							v-model="switchEnable"
							type="checkbox"
							@click="updateSwitchEnable"
						>

						<form-switch
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
			<div
				:class="props.overflowScroll?'overflow-y-scroll':''"
			>
				<!-- data to be displayed -->
				<div
					:class="(props.previewCol || props.noPreview )?'':'md:grid-cols-2'"
					class="grid grid-cols-1 gap-5"
				>
					<div>
						<form-number
							v-if="props.switch"
							v-show="!props.noSwitch"
							v-model="theBlock.switch"
							label="switch"
							name="switch"
						/>
						<form-input
							v-show="!props.noTitle"
							v-model="theBlock.title"
							focus
							label="titre"
							name="title"
						/>

						<form-select
							v-show="!props.noType"
							v-model="theBlock.type"
							label="type du block"
							name="type2"
						>
							<option value="">
								-
							</option>
							<option
								v-for="(item, key) in postType"
								:key="key"
								:value="key"
							>
								{{ item.text }}
							</option>
						</form-select>

						<form-textarea
							ref="formBody"
							v-model="theBlock.body"
							:rows="11"
							label="corps"
							name="body"
						/>
					</div>

					<div
						v-if="!props.noPreview"
						class="pt-8 pb-3 px-3"
					>
						<button
							v-if="theBlock.script"
							class="btn btn-xs"
							@click="random++"
						>
							Aléatoire
						</button>
						<markdown-it
							:text="blockBody"
							class="p-3 bg-gray-100 border border-dashed border-gray-200 h-full"
						/>
					</div>
				</div>

				<div
					v-if="1===0"
					class="w-full"
				>
					<form-button
						v-if="props.maxIllustration===null || theBlock.illustrations.length < props.maxIllustration"
						@click="theBlock.illustrations.push({
							title: '',
							type: 'draw',
							code: '',
							parameters: ''
						})"
					>
						Ajouter une illustration
					</form-button>
				</div>
				<div
					v-if="theBlock.illustrations?.length>0 && 1===0"
					class="w-full"
				>
					<div
						v-for="(illustration, index) of theBlock.illustrations"
						:key="`illustration-${index}`"
						class="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3"
					>
						<div>
							<form-illustration
								v-model="theBlock.illustrations[index]"
								:label="`illustration ${index}`"
								:name="`illustration-${index}`"
							/>
						</div>
						<div class="hidden md:block">
							<illustration-show :illustration="theBlock.illustrations[index]" />
							<button
								class="btn-delete btn-xs float-right"
								@click="theBlock.illustrations.splice(index,1)"
							>
								<i class="bi bi-trash" />Supprimer
							</button>
						</div>
					</div>
				</div>

				<div
					v-show="!props.noScript || !props.noData"
					class="grid grid-cols-1 md:grid-cols-2 gap-3"
				>
					<form-textarea
						v-show="!props.noScript"
						v-model="theBlock.script"
						:rows="8"
						label="script"
						name="script"
					/>

					<form-textarea
						v-show="!props.noData"
						v-model="theBlock.json"
						:rows="8"
						label="data"
						name="json"
					/>
				</div>
			</div>
		</div>
	</dialog-modal>
</template>

<script setup>

import FormInput from "@/Components/Form/FormInput"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormButton from "@/Components/Form/FormButton"
import FormIllustration from "@/Components/Form/FormIllustration"
import FormSwitch from "@/Components/Form/FormSwitch"
import FormNumber from "@/Components/Form/FormNumber"
import {computed, inject, ref} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import FormSelect from "@/Components/Form/FormSelect"
import IllustrationShow from "@/Components/Posts/Illustrations/IllustrationShow.vue"
import DialogModal from "@/Components/Ui/DialogModal.vue"
import ConfirmButton from "@/Components/Ui/ConfirmButton.vue"
import {PiMath} from "pimath/esm"
import {useFormattedBody} from "@/Composables/useHelpers"
import {useBlockTypes} from "@/scolcours"

const emits = defineEmits(["update:modelValue", "change", "destroy"])
const props = defineProps({
	block: {type: Object, required: true},
	modelValue: {type: Boolean, default: false},	// show or hide the block dialog
	switch: {type: Boolean},
	noTitle: {type: Boolean, default: false},
	noType: {type: Boolean, default: false},
	noSwitch: {type: Boolean, default: false},
	noScript: {type: Boolean, default: false},
	noData: {type: Boolean, default: false},
	noBlur: {type: Boolean, default: false},
	previewCol: {type: Boolean, default: false},
	overflowScroll: {type: Boolean, default: false},
	maxIllustration: {type: [Number,null], default: null}
})

let show = ref(props.modelValue),
	theBlock = ref(props.block),
	switchEnable = ref(props.block.switch!==null)

//TODO:  Duplicate code with "blocks" -> move to composable ?
let random = ref(1),
	postData = inject("postData", {}),
	blockData = computed(() => {
		try {
			if (props.block.script !== null && random.value>0) {
				let F = new Function("PiMath", "postData", props.block.script)
				return {...postData.value, ...F(PiMath, postData.value)}
			}
		}catch(e){
			console.log("Block form (script)", e)
		}

		return {...postData.value}
	}),
	blockBody = computed(() => {
		return useFormattedBody(props.block.body, blockData)
	})

let updateSwitchEnable = function(){
	if(switchEnable.value){
		theBlock.value.switch = false
	}else{
		theBlock.value.switch = null
	}
}
let saveBlock = function () {
		axios.post(
			route("blocks.update", [theBlock.value.id]),
			{
				...theBlock.value,
				switch:switchEnable.value?theBlock.value.switch:null,
				_method: "PATCH"
			}
		).then(res=>{
			emits("update:modelValue", false)
			emits("change", res.data.data)
		}).catch(error=>{
			console.error(error)
		})
	},
	deleteBlock = function(){
		axios
			.post(
				route("blocks.destroy", [props.block.id]),
				{_method: "delete"}
			)
			.then((res)=>{
				emits("update:modelValue", false)
				emits("destroy", props.block.id)
			})
			.catch(error => console.error(error))
	}

const postType = useBlockTypes
</script>
