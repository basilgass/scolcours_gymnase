<template>
	<form-field>
		<div class="mb-3">
			<form-label
				:label="label"
				:name="name"
			/>

			<form-input
				v-model="theModel.title"
				name="title"
				label="nom de la figure"
			/>

			<form-input
				v-model="theModel.css"
				name="css"
				label="css"
				class="font-code"
			/>
		</div>

		<div class="grid grid-cols-1 gap-3">
			<div class="w-full grid grid-cols-3 gap-3">
				<button
					class="btn"
					:class="modelValue.type==='image'?'bg-amber-200':'bg-white'"
					@click.prevent="theModel.type='image'"
				>
					Image
				</button>
				<button
					class="btn"
					:class="modelValue.type==='draw'?'bg-amber-200':'bg-white'"
					@click.prevent="theModel.type='draw'"
				>
					Draw
				</button>
				<button
					class="btn"
					:class="modelValue.type==='component'?'bg-amber-200':'bg-white'"
					@click.prevent="loadComponents"
				>
					Component
				</button>
			</div>

			<!-- image illustration -->
			<div
				v-if="modelValue.type==='image'"
				class="col-span-2 mb-5"
			>
				<form-image-drop
					@file-dropped="imageFileDropped"
				/>
			</div>
			<!-- draw illustration -->
			<div
				v-else-if="modelValue.type==='draw'"
				class="col-span-2 h-full w-full"
			>
				<form-input
					v-model="theModel.parameters"
					label="paramètres"
					name="drawParameters"
				/>
				<form-textarea
					v-model="theModel.code"
					:hide-label="true"
					name="drawData"
					:rows="10"
				/>
			</div>

			<!-- component illustration -->
			<div
				v-else
				class="col-span-2 border-dashed border-gray-200 border-2 rounded h-full w-full grid grid-cols-1 text-center items-center"
			>
				<ol v-if="chapterComponents">
					<li
						v-for="(description, comp) of chapterComponents"
						:key="comp"
						:class="theModel.value===comp?'btn-success':'btn'"
						@click="theModel.value=comp"
					>
						{{ comp }}
					</li>
				</ol>
				<form-input
					v-model="theModel.parameters"
					label="parametres"
					name="drawParameters"
				/>
				<form-textarea
					v-model="theModel.code"
					:hide-label="true"
					name="drawData"
					:rows="10"
				/>
				<markdown-it
					v-if="chapterComponents[theModel.value]"
					class="font-code text-left"
					:text="chapterComponents[theModel.value]"
				/>
			</div>
		</div>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import {computed, onMounted, ref} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea"
import FormInput from "@/Components/Form/FormInput"
import MarkdownIt from "@/Components/Ui/MarkdownIt.vue"
import FormImageDrop from "@/Components/Form/FormImageDrop.vue"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {
		type: Object, default: () => {
			return {
				title: "",
				type: "draw",
				value: "",
				code: "",
				parameters: "",
				css: "",
				order: 0
			}
		}
	},
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false}
})

function imageFileDropped(e){
	theModel.value.code = e
	emit("update:modelValue", theModel.value)
}

let chapterComponents = ref({})
function loadComponents(){
	theModel.value.type="component"
	axios.get(route("illustrations.components"))
		.then(res=> {
			chapterComponents.value = res.data
		})
		.catch(err=>console.log(err))
}
let theModel = computed({
	get: ()=>props.modelValue,
	set: (value) => emit("update:modelValue", value)
})

onMounted(()=>{
	if(props.modelValue.type==="component"){
		loadComponents()
	}
})
</script>
