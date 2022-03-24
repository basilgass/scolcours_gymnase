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
					@click.prevent="theModel.type='component'"
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
				<form-textarea
					v-model="theModel.code"
					:hide-label="true"
					name="drawData"
					:rows="10"
				/>
			</div>
			<div v-else>
				Something else ?
			</div>
		</div>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import {computed} from "vue"
import FormTextarea from "@/Components/Form/FormTextarea"

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

let theModel = computed({
	get: ()=>props.modelValue,
	set: (value) => emit("update:modelValue", value)
})
</script>
