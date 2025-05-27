<script setup lang="ts">

defineProps<{
	type?: string
}>()
</script>

<template>
	<div class="text-red-500">
		Le type de champ {{ type }} n'est pas reconnu.
	</div>
</template>

<style scoped>

</style>
