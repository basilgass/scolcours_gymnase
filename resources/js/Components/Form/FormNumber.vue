<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<input
			:id="name"
			:name="name"
			:value="modelValue"
			class="border border-gray-200 p-2 w-full rounded"
			type="number"
			@input="$emit('update:modelValue', $event.target.value)"
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

defineEmits(["update:modelValue"])
defineProps({
	modelValue: {type: Number, default: null},
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""}
})
</script>
