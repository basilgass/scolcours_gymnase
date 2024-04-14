<script setup lang="ts">

const theValue = defineModel<string | number | boolean | null>({
	set(value) {
		// Make sure it's a string
		return `${value}`
	},
	required: true
})

</script>

<template>
	<input v-model="theValue">
</template>

<style scoped>

</style>
