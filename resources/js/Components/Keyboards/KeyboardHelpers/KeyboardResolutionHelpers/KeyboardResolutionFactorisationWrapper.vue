<script setup lang="ts">

defineProps<{
	tex: string,
	errorMessage: string
}>()
</script>

<template>
	<div>
		<div v-katex.boxed="tex" />
		<div
			v-show="errorMessage"
			v-katex.auto="errorMessage"
			class="border border-red-600 bg-red-50 text-red-600
		 px-3 py-1 mb-2
		 text-sm"
		/>

		<slot />
	</div>
</template>

<style scoped>

</style>
