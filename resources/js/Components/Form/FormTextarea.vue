<template>
	<form-field :hide-label="hideLabel">
		<form-label
			v-if="!hideLabel"
			:label="label"
			name="name"
		/>
		<textarea
			:id="name"
			:rows="rows"
			class="border border-gray-200 w-full rounded px-3 py-2"
			:class="hideLabel?'':'p-2'"
			:value="modelValue"
			@input="$emit('update:modelValue', $event.target.value)"
		/>

		<form-error
			:name="name"
			:message="error"
		/>
	</form-field>
</template>
<script setup>
import FormField from '@/Components/Form/FormField'
import FormLabel from '@/Components/Form/FormLabel'
import FormError from '@/Components/Form/FormError'

defineEmits(['update:modelValue'])
const props = defineProps({
	modelValue: {type: String, default: ''},
	name: {type: String, required: true},
	label: {type: String, default: ''},
	error: {type: String, default: ''},
	rows: {type: Number, default: 4},
	hideLabel: {type: Boolean, default: false},
})
</script>
