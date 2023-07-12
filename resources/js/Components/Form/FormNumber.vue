<template>
	<form-field>
		<form-label
			v-if="!props.inline"
			:label="label"
			:name="name"
		/>
		<input
			:id="name"
			ref="inp"
			:name="name"
			:value="modelValue"
			class="border border-gray-200 p-2 w-full rounded"
			type="number"
			v-bind="$attrs"
			:placeholder="inline?label:''"
			@focus="$emit('inputFocus')"
			@input="$emit('update:modelValue', +$event.target.value)"
			@keyup.esc="doCancel"
			@keyup.enter="doValidate"
		>
		<div
			v-if="helperText!==''"
			v-katex.auto="helperText"
			class="text-xs text-gray-400"
		/>
		<form-error
			:message="error"
			:name="name"
		/>
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField"
import FormLabel from "@/Components/Form/FormLabel"
import FormError from "@/Components/Form/FormError"
import {onMounted, ref} from "vue"

const emits = defineEmits(["update:modelValue", "enter", "cancel", "inputFocus"])
const props = defineProps({
	inline: {type: Boolean, default: false},
	modelValue: {type: Number, default: null},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""},
	focus: {type: Boolean, default: false},
	helperText: {type: String, default: ""},
})

let inp = ref(null)

function doCancel(){
	emits("update:modelValue", originalValue.value)
	emits("cancel")
}
function doValidate(){
	emits("enter")
}

function focus(select){
	inp.value.focus()
	if(select===true){
		inp.value.select()
	}
}
onMounted(() => {
	if (props.focus) {
		inp.value.focus()
		inp.value.select()
	}
})
defineExpose({focus})

</script>
