<template>
	<div class="w-full max-h-[50%]">
		<!-- header -->
		<!-- todo: make the header of block form "fixed" at the top of the box -->
		<div class="flex gap-3 pb-3 items-baseline border-b">
			<button
				class="btn-success btn-xs"
				@click="update_block"
			>
				Enregistrer
			</button>
			<button
				class="btn-cancel btn-xs"
				@click="cancel_block"
			>
				Annuler
			</button>

			<form-switch
				v-show="!props.noSwitch"
				v-model="form.blur"
				class="ml-auto"
				label="Bloc flouté,Bloc visible"
				name="blur"
			/>
		</div>

		<div class="overflow-y-scroll">
			<!-- data to be displayed -->
			<div class="grid grid-cols-1 gap-5 md:grid-cols-2">
				<div>
					<form-number
						v-show="!props.noSwitch"
						v-if="props.switch"
						v-model="form.switch"
						name="switch"
						label="switch"
					/>
					<form-input
						v-show="!props.noTitle"
						v-model="form.title"
						name="title"
						label="titre"
						focus
					/>

					<form-select
						v-show="!props.noType"
						v-model="form.type"
						name="type2"
						label="type du block"
					>
						<option value="">
							-
						</option>
						<option value="definition">
							définition
						</option>
						<option value="theorem">
							théorème
						</option>
						<option value="property">
							propriété
						</option>
					</form-select>

					<form-textarea
						ref="formBody"
						v-model="form.body"
						name="body"
						label="corps"
						:rows="11"
						@keyup.ctrl.enter="update_block"
					/>
				</div>

				<div class="pt-8 pb-3 px-3">
					<markdown-it
						:text="form.body"
						class="p-3 bg-gray-100 border border-dashed border-gray-200 h-full"
					/>
				</div>
			</div>

			<div class="w-full">
				<form-button
					@click="form.illustrations.push({
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
				v-if="form.illustrations.length>0"
				class="w-full"
			>
				<div
					v-for="(illustration, index) of form.illustrations"
					:key="`illustration-${index}`"
					class="grid grid-cols-1 md:grid-cols-2 gap-3 space-y-3"
				>
					<div>
						<form-illustration
							v-model="form.illustrations[index]"
							:name="`illustration-${index}`"
							:label="`illustration ${index}`"
						/>
					</div>
					<div class="hidden md:block">
						<illustration-show :illustration="form.illustrations[index]" />
						<button
							class="btn-delete btn-xs float-right"
							@click="form.illustrations.splice(index,1)"
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
					v-model="form.script"
					name="script"
					label="script"
					:rows="8"
				/>

				<form-textarea
					v-show="!props.noData"
					v-model="form.json"
					name="json"
					label="data"
					:rows="8"
				/>
			</div>
		</div>
	</div>
</template>

<script setup>

import FormInput from "@/Components/Form/FormInput"
import {useForm} from "@inertiajs/inertia-vue3"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormButton from "@/Components/Form/FormButton"
import FormIllustration from "@/Components/Form/FormIllustration"
import FormSwitch from "@/Components/Form/FormSwitch"
import FormNumber from "@/Components/Form/FormNumber"
import {ref, watch} from "vue"
import MarkdownIt from "@/Components/Ui/MarkdownIt"
import FormSelect from "@/Components/Form/FormSelect"
import IllustrationShow from "@/Components/Posts/IllustrationShow"

const emits = defineEmits(["close", "save", "update:modelValue"])
const props = defineProps({
	modelValue: {type: Object},
	switch: {type: Boolean},
	noTitle: {type: Boolean, default: false},
	noType: {type: Boolean, default: false},
	noSwitch: {type: Boolean, default: false},
	noScript: {type: Boolean, default: false},
	noData: {type: Boolean, default: false},

})

const form = useForm({
	id: props.modelValue.id,
	title: props.modelValue.title,
	body: props.modelValue.body,
	type: props.modelValue.type,
	script: props.modelValue.script,
	json: props.modelValue.json,
	illustrations: props.modelValue.illustrations,
	blur: props.modelValue.blur,
	switch: props.modelValue.switch
})

let formBody = ref(null)
function focus(select){
	formBody.value.focus(select)
}
defineExpose({focus})

function update_block(){
	axios.post(
		route("blocks.update", [form.id]),
		{
			...form.data(),
			_method: "patch"
		}
	).then(res=>{
		emits("update:modelValue", form)
		emits("save")
		emits("close")
	}).catch(error=>{
		console.log(error)
	})
}

function cancel_block(){
	emits("close")
}


// Watch changes to the json object as it can be modified from "outside".
watch(()=> props.modelValue.json, (newValue, oldValue)=>{
	form.json = newValue
})

</script>
