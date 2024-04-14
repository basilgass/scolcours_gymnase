<script lang="ts" setup>

const theValue = defineModel<string | number | boolean | null>()
</script>

<template>
	<div class="w-full">
		<input v-model="theValue">
	</div>

	<!-- Display the error message -->
</template>

<style scoped>


</style>
