<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<div class="grid grid-cols-3 gap-3">
			<div class="grid grid-flow-row gap-3 content-start">
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
			<div
				v-if="modelValue.type==='image'"
				class="col-span-2 border-dashed border-gray-200 border-2 rounded h-full w-full grid grid-cols-1 text-center items-center"
			>
				Glisser / déposer une image
			</div>
			<div
				v-else-if="modelValue.type==='draw'"
				class="col-span-2 h-full w-full"
			>
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
			</div>
			<div
				v-else
				class="col-span-2 border-dashed border-gray-200 border-2 rounded h-full w-full grid grid-cols-1 text-center items-center"
			>
				<form-input
					v-model="theModel.parameters"
					label="parametres"
					name="drawParameters"
				/>
				<ol v-if="chapterComponents.length>0">
					<li
						v-for="comp of chapterComponents"
						:key="comp"
						:class="theModel.code===comp?'btn-success':'btn'"
						@click="theModel.code=comp"
					>
						{{ comp }}
					</li>
				</ol>
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
import {usePage} from "@inertiajs/inertia-vue3"

defineEmits(["update:modelValue", "inputFocus"])
let props = defineProps({
	modelValue: {
		type: Object, default: () => {
			return {
				title: "",
				type: "draw",
				code: "",
				parameters: ""
			}
		}
	},
	active: {type: Boolean, default: false},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false}
})

let chapterComponents = ref([])

function loadComponents(){
	theModel.value.type="component"
	axios.get(route("chapters.components", [usePage().props.value.chapter.slug]))
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
