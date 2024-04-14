<script setup lang="ts">

const theValue = defineModel<string>({
	set(value) {
		// Make sure it's a string
		return `${value}`
	}
})

</script>

<template>
	<input v-model="theValue">
</template>

<style scoped>

</style>
