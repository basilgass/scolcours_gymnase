<script setup lang="ts">

import FormMaker from "@/Components/Form/FormMaker.vue"

const theValue = defineModel<string | number>({
	set(value) {
		// Make sure it's a string
		return `${value}`
	}
})

</script>

<template>
	<form-maker
		class="mt-20"
		v-model="theValue"
	/>
</template>

<style scoped>

</style>
