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
				type="file"
				multiple
				class="hidden"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.files)"
			>
		<form-error :name="name" />
	</form-field>
</template>

<script setup>
	import FormField from "@/Components/Form/FormField"
	import FormLabel from "@/Components/Form/FormLabel"
	import FormError from "@/Components/Form/FormError"
	import {ref} from "vue"

	defineEmits(["update:modelValue"])
	defineProps({
		modelValue: {type: String, default: ""},
		name: {type: String, required: true},
		label: {type: String, default: ""},
	})
	const inputElement = ref(null)
</script>
