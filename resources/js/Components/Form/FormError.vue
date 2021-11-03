<template>
	<p class="text-red-500 text-xs mt-0">
		{{ message }}
	</p>
</template>
<script setup>
	const props = defineProps({
		message: {default: "", type: String}
	})

</script>
