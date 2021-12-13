<template>
	<form-field>
		<form-label
				:label="label"
				:name="name"
			/>
		<input
				:id="name"
				:name="name"
				class="border border-gray-200 p-2 w-full rounded"
				:value="modelValue"
				@input="$emit('update:modelValue', $event.target.value)"
			>
		<form-error
				:name="name"
				:message="error"
			/>
		<slot />
	</form-field>
</template>
<script setup>
import FormField from '@/Components/Form/FormField'
import FormLabel from '@/Components/Form/FormLabel'
import FormError from '@/Components/Form/FormError'

defineEmits(['update:modelValue'])
defineProps({
	modelValue: {type: String, default: ''},
	name: {type: String, required: true},
	label: {type: String, default: ''},
	error: {type: String, default: ''}
})

</script>
