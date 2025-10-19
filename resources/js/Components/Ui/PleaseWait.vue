<script lang="ts" setup>
// DESIGNS : faire un composant de chargement qui déchire.

defineProps<{
	text?: string
}>()
</script>

<template>
	<div>
		<p><i class="bi bi-watch" /> {{ text ?? 'merci de patienter...' }}</p>
	</div>
</template>

<style scoped>

</style>
