<template>
	<form-field>
		<form-label
			v-if="!props.inline"
			:label="label"
			:name="name"
		/>
		<input
			:id="name"
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

const emits = defineEmits(["update:modelValue", "enter", "cancel", "inputFocus"])
const props = defineProps({
	inline: {type: Boolean, default: false},
	modelValue: {type: Number, default: null},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""}
})

function doCancel(){
	emits("update:modelValue", originalValue.value)
	emits("cancel")
}
function doValidate(){
	emits("enter")
}

</script>
