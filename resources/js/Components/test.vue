<script setup lang="ts">
import FormMaker from "@/Components/Form/FormMaker.vue"

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

	<form-maker
		v-model="theValue"
		type="text"
	/>
	<form-maker
		v-model="theValue"
		type="textarea"
	/>
</template>

<style scoped>

</style>
