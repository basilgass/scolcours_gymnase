<template>
	<label
		:for="name"
		class="block mb-2 uppercase font-bold text-xs text-gray-700"
	>
		{{ label === '' ? name : label ?? '' }}
	</label>
</template>
<script setup>
const props = defineProps({
	label: {type: String, default: ""},
	name: {type: String, required: true},
})
</script>
