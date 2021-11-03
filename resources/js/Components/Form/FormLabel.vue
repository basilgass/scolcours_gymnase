<template>
	<label
		:for="name"
		:name="name"
		class="block mb-2 uppercase font-bold text-xs text-gray-700"
	>
		{{ this.label === '' ? this.name : this.label }}
	</label>
</template>

<script setup>
const props = defineProps({
	name: {type: String, required: true},
	label: {type: String, default: ""},
})
</script>
