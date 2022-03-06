<template>
	<div :class="{'mt-6': !hideLabel}">
		<slot />
	</div>
</template>

<script setup>
defineProps({
	hideLabel: {type: Boolean, default: false}
})
</script>