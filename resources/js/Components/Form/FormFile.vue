<template>
	<form-field>
		<form-label
			:label="label"
			:name="name"
		/>
		<button
			class="w-full border-dashed h-24 border rounded text-gray-400"
			@click.prevent="inputElement.click()"
		>
			Charger une ou plusieurs image(s)
		</button>

		<input
			:id="name"
			ref="inputElement"
			:name="name"
			:value="modelValue"
			class="hidden"
			multiple
			type="file"
			@input="$emit('update:modelValue', $event.target.files)"
		>
		<form-error :name="name" />
	</form-field>
</template>

<script setup>
import FormField from "@/Components/Form/FormField.vue"
import FormLabel from "@/Components/Form/FormLabel.vue"
import FormError from "@/Components/Form/FormError.vue"
import {ref} from "vue"

defineEmits(["update:modelValue"])
defineProps({
	modelValue: {type: String, default: ""},
	name: {type: String, required: true},
	label: {type: String, default: ""},
})
const inputElement = ref(null)
</script>
