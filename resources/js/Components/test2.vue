<script setup lang="ts">

import Test from "@/Components/test.vue"

const theValue = defineModel<string | number>({
	set(value) {
		// Make sure it's a string
		return `${value}`
	}
})

</script>

<template>
	<test
		v-model="theValue"
	/>
</template>

<style scoped>

</style>
