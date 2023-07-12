<template>
	<form-field :hide-label="hideLabel">
		<form-label
			v-if="!hideLabel"
			:label="label"
			name="name"
		/>
		<textarea
			:id="name"
			ref="inp"
			:rows="rows"
			class="border border-gray-200 w-full rounded px-3 py-2 font-code tracking-tighter"
			:class="hideLabel?'':'p-2'"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
		/>

		<slot />
		<div
			v-if="helperText!==''"
			v-katex.auto="helperText"
			class="text-xs text-gray-400"
		/>
		<form-error
			:name="name"
			:message="error"
		/>
	</form-field>
</template>
<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import FormError from "@/Components/Form/FormError"
import {ref} from "vue"

let inp = ref(null)
function focus(select){
	inp.value.focus()
	if(select===true){
		inp.value.select()
	}
}
defineExpose({focus})
defineEmits(["update:modelValue"])
const props = defineProps({
	modelValue: {type: String, default: ""},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	rows: {type: Number, default: 4},
	hideLabel: {type: Boolean, default: false},
	codeWriting: {type: Boolean, default: false},
	helperText: {type: String, default: ""}
})
</script>
