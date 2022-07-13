<template>
	<div class="mt-2">
		<slot />
	</div>
</template>

<script setup>
defineProps({
	hideLabel: {type: Boolean, default: false}
})
</script>
