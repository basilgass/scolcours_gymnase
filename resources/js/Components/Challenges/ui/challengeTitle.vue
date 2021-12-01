<template>
	<h1 class="text-xl">
		{{ title }}
	</h1>
</template>
<script setup>
	defineProps({
		title: String
	})
</script>