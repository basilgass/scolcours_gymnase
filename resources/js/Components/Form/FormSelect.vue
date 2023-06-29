<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>

		<select
			:id="name"
			class="border border-gray-200 p-2 w-full rounded"
			:value="modelValue"
			@change="changeEvent"
		>
			<slot />
		</select>

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

const emits = defineEmits(["update:modelValue"])
const props = defineProps({
	modelValue: {type: String, default: "", },
	name: {type: String, required: true},
	label: {type: String, default: ""},
	error: {type: String, default: ""}
})

let changeEvent = function(event){
	emits("update:modelValue", event.target.value)
}
</script>
